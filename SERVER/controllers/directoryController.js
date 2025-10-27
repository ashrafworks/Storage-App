import path from "node:path";
import { rm } from "node:fs/promises";
import Directory from "../models/DirectoryModel.js";
import File from "../models/FileModel.js";

export const getDirectoryContents = async (req, res, next) => {
  try {
    const user = req.user;

    const id = req.params.id || user.rootDirId.toString();
    
    const directoryData = await Directory.findOne({
      _id: id,
      userId: user._id,
    }).lean();

    if (!directoryData) {
      return res.status(404).json({
        error: "Directory not found or you do not have access to it!",
      });
    }

    const directories = await Directory.find({ parentDirId: id }).lean();
    const files = await File.find({ parentDirId: id }).lean();

    return res.json({
      ...directoryData,
      directories: directories.map(({ _id, ...dir }) => ({ id: _id, ...dir })),
      files: files.map(({ _id, ...file }) => ({ id: _id, ...file })),
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const createDirectory = async (req, res, next) => {
  try {
    const user = req.user;

    const parentDirId = req.params.parentdirid || user.rootDirId;

    const parentDirData = Directory.findOne({
      _id: parentDirId,
      userId: user._id,
    });

    // Check if parent directory exists
    if (!parentDirData) {
      return res.status(404).json({ error: "Parent directory not found!" });
    }

    const dirname = req.headers.dirname || "New Folder";

    await Directory.create({
      name: dirname,
      userId: user._id,
      parentDirId,
    });

    return res.status(200).json({ message: "Directory Created!" });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

export const renameDirectory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newDirName } = req.body;
    const user = req.user;

    const directoryData = await Directory.findOne(
      {
        _id: id,
        userId: user._id,
      }
    );

    if (!directoryData) {
      return res.status(404).json({ message: "Directory not found!" });
    }

    const oldDirname = directoryData.name;

    directoryData.name = newDirName || oldDirname;
    await directoryData.save();

    return res.json({ message: `Folder rename successfully.` });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteDirectory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const directoryData = await Directory.findOne(
      {
        _id: id,
        userId: user._id,
      },
      "_id"
    );

    if (!directoryData) {
      return res.status(404).json({ message: "Directory not found!" });
    }

    async function getDirectoryContents(id) {
      let directories = await Directory.find({ parentDirId: id }, "_id");

      let files = await File.find({ parentDirId: id }, "extname");

      for (const { _id } of directories) {
        const { files: childFiles, directories: childDirectories } =
          await getDirectoryContents(_id);

        files = [...files, ...childFiles];
        directories = [...directories, ...childDirectories];
      }

      return { files, directories };
    }
    const { files, directories } = await getDirectoryContents(id);

    for (const { _id, extname } of files) {
      await rm(
        `${path.dirname(
          import.meta.dirname
        )}/storage/${_id.toString()}${extname}`
      );
    }
    

    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    await Directory.deleteMany({
      _id: { $in: [...directories.map(({ _id }) => _id), id] },
    });

    return res.json({
      message: "Folder and its contents deleted successfully.",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

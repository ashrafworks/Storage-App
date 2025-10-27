import { rm } from "node:fs/promises";
import path from "node:path";
import { createWriteStream } from "node:fs";
import File from "../models/FileModel.js";
import Directory from "../models/DirectoryModel.js";
import { Types } from "mongoose";

export const uploadFile = async (req, res, next) => {
  try {
    const user = req.user;
    const parentDirId = req.params.parentdirid || user.rootDirId;

    const parentDirData = await Directory.findOne({
      _id: parentDirId,
      userId: user._id,
    }).lean();

    if (!parentDirData) {
      return res.status(404).json({ error: "Parent directory not found!" });
    }

    const filename = req.headers.filename || "untitled";

    const extname = path.extname(filename);
    const fileId = new Types.ObjectId();

    const fullFileName = `${fileId}${extname}`;

    const writeStream = createWriteStream(`./storage/${fullFileName}`, {
      highWaterMark: 64 * 1024,
    });
    req.pipe(writeStream);

    req.on("end", async () => {
      await File.create({
        _id: fileId,
        userId: user._id,
        extname,
        name: filename,
        parentDirId,
      });

      return res.status(201).json({ message: "File Uploaded" });
    });
  } catch (error) {
    console.log("file not uploaded");
    console.log(error.message);
    next(error);
  }
};

export const getFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const fileData = await File.findOne({
      _id: id,
      userId: user._id,
    });

    if (!fileData) {
      return res.sendFile(`${path.dirname(import.meta.dirname)}/404-page.html`);
    }

    if (req.query.action === "download") {
      res.download(
        `${path.dirname(import.meta.dirname)}/storage/${id}${fileData.extname}`,
        fileData.name
      );
    }

    if (fileData.extname === ".mp4") {
      res.set("Content-Type", "video/mp4");
    }

    // Send file

    return res.sendFile(
      `${path.dirname(import.meta.dirname)}/storage/${id}${fileData.extname}`,
      (err) => {
        if (!res.headersSent && err) {
          return res.status(404).json({ error: "File not found!" });
        }
      }
    );
  } catch (error) {
    console.log("file not access error");
    console.log(error);
    next(error);
  }
};

export const renameFile = async (req, res, next) => {
  try {
    const newFilename = req.body.newFilename || "untittled";
    const user = req.user;
    const { id } = req.params;

    const fileData = await File.findOne({
      _id: id,
      userId: user._id,
    });

    if (!fileData) {
      return res.status(404).json({ message: "Directory not found!" });
    }

    fileData.name = newFilename;
    await fileData.save();

    return res.json({ message: "file rename successfully." });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const fileData = await File.findOne({ _id: id, userId: user._id });

    if (!fileData) return res.status(404).json({ error: "File not found!" });

    const fileName = `${fileData._id}${fileData.extname}`;
    await rm(`${path.dirname(import.meta.dirname)}/storage/${fileName}`, {
      recursive: true,
    });

    await fileData.deleteOne();

    return res.json({ message: `${fileData.name} deleted successfully.` });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

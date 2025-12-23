// import { open, rename, rm } from "node:fs/promises";
// import path from "node:path";
// import express from 'express';
// import { createPath } from "../practics.js";

// const router = express.Router();

// // Files Routes

// // View and Download Files
// router.get("/{*path}", (req, res) => {
//   const fullPath = createPath(req.params.path);

//   if (req.query.action === "download") {
//     res.set("Content-Disposition", "attachment");
//   }

//   // isko is liye set kiya hai q k header by default application/mp4 ja rha tha jis sai file open kai bajaye download horhi thi
//   if (fullPath.endsWith(".mp4")) {
//     res.set("Content-Type", "video/mp4");
//   }

//   res.sendFile(fullPath);
// });

// // Create Files
// router.post("/{*path}", async (req, res) => {
//   try {
//     const filePath = createPath(req.params.path);
//     const fileHandle = await open(filePath, "w");
//     const writeStream = fileHandle.createWriteStream({
//       highWaterMark: 60 * 1024,
//     });

//     req.pipe(writeStream);

//     req.on("end", () => {
//       res.json({
//         message: `${path.basename(filePath)} uploaded successfully.`,
//       });
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ message: error.message });
//   }
// });

// // Rename Files
// router.patch("/{*path}", async (req, res) => {
//   try {
//     const oldFilename = req.body.oldFilename;
//     const newFilename = createPath(req.params.path);

//     await rename("./storage/" + oldFilename, newFilename);

//     res.json({ message: "file rename successfully." });
//   } catch (error) {
//     console.log(error.messagef);
//     res.json({ message: error.message });
//   }
// });

// // Delete Folders and filesg
// router.delete("/{*path}", async (req, res) => {
//   try {
//     const fullPath = createPath(req.params.path);
//     await rm(fullPath, { recursive: true });

//     res.json({ message: `${path.basename(fullPath)} deleted successfully.` });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message });
//   }
// });

// router.post("/upload", upload.single("file"), async (req, res, next) => {
//   if(!req.file) return res.status(400).json({message: 'please choose a file then upload!'});

//   const { id, originalname } = req.file;
//   const userId = req.userId;
//   let parentDirId;
//   let parentDirData;

//   if(req.body.parentdirid) {
//     parentDirId = req.body.parentdirid;

//     parentDirData = directoriesData.find(
//       (directory) => directory.id === parentDirId
//     );
//   } else {
//     parentDirData = directoriesData.find((directory) => (
//       directory.userId === userId && directory.parentDirId === null
//     ));
//     parentDirId = parentDirData.id;
//   }

//   parentDirData.files.push(id);

//   filesData.push({
//     id,
//     userId,
//     extname: path.extname(originalname),
//     name: originalname,
//     parentDirId,
//   });

//   try {
//       await writeFile(
//       `${path.dirname(import.meta.dirname)}/filesDB.json`,
//       JSON.stringify(filesData)
//     );
//       await writeFile(
//         `${path.dirname(import.meta.dirname)}/directoriesDB.json`,
//         JSON.stringify(directoriesData)
//       );

//       return res.json({
//         message: `${originalname} uploaded successfully.`,
//       });

//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// });

// // export router
// export default router;








// import path from "node:path";
// import { mkdir, open, readdir, rename, rm, stat } from "node:fs/promises";
// import express from "express";
// import { createPath } from "../practics.js";

// // const router = express.Router();

// // directory Routes

// router.get("/{*path}", async (req, res) => {
//   try {
//     const fullPath = createPath(req.params.path);
//     const dirData = await readdir(fullPath);
//     const fullData = await Promise.all(
//       dirData.map(async (item) => {
//         const stats = await stat(`${fullPath}/${item}`);
//         return {
//           name: item,
//           isDirectory: stats.isDirectory(),
//         };
//       })
//     );
//     res.json(fullData);
//   } catch (error) {
//     console.log(error.message);
//     res.json({ message: error.message });
//   }
// });

// router.post("/{*path}", async (req, res) => {
//   try {
//     const fullPath = createPath(req.params.path);
//     await mkdir(fullPath);

//     res.json({ message: `Folder Created successfully.` });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ message: error.message });
//   }
// });


// // Create Files
// router.post("/:filename", async (req, res, next) => {
//   try {
//     const filename = req.params.filename || "untitled";
//     const id = crypto.randomUUID();
//     const extension = path.extname(filename);
//     const fullname = `${id}${extension}`;
//     const parentDirId = req.headers.parentdirid || directoriesData[0].id;

//     const writeStream = createWriteStream(
//       `${path.dirname(import.meta.dirname)}/storage/${fullname}`,
//       {
//         highWaterMark: 100 * 1024,
//       }
//     );

//     req.pipe(writeStream);

//     // ✅ Wait until stream fully finishes writing
//     writeStream.on("finish", async () => {
//       const parentDirData = directoriesData.find(
//         (directory) => directory.id === parentDirId
//       );

//       parentDirData.files.push(id);

//       filesData.push({
//         id,
//         extname: extension,
//         name: filename,
//         parentDirId,
//       });

//       await writeFile(
//         `${path.dirname(import.meta.dirname)}/filesDB.json`,
//         JSON.stringify(filesData)
//       );
//       await writeFile(
//         `${path.dirname(import.meta.dirname)}/directoriesDB.json`,
//         JSON.stringify(directoriesData)
//       );

//       res.json({
//         message: `${path.basename(filename)} uploaded successfully.`,
//       });
//     });

//     // ✅ Handle stream errors
//     writeStream.on("error", (err) => {
//       console.log("Stream error:", err.message);
//       res.status(500).json({ message: "File upload failed." });
//     });
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// });




// // export default router;





// import bcrypt from "bcrypt";

// const hashPassword = await bcrypt.hash("ashraf", 12);
// console.log(hashPassword)


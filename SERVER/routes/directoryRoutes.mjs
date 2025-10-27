import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { createDirectory, deleteDirectory, getDirectoryContents, renameDirectory } from "../controllers/directoryController.js";

const router = express.Router();

router.param("id", validateIdMiddleware); // Id ko validate karnay kai liye

router.get("/{:id}", getDirectoryContents);

router.param("parentdirid", validateIdMiddleware); // Id ko validate karnay kai liye

router.post("/{:parentdirid}", createDirectory);

router.delete("/:id", deleteDirectory);

router.patch("/:id", renameDirectory);

export default router;

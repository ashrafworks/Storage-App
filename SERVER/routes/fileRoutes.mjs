import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { deleteFile, getFile, renameFile, uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.param("id", validateIdMiddleware); // validate parentdirid param

router.post("/{:parentdirid}", uploadFile);

router.param("parentdirid", validateIdMiddleware); // validate id param

router.get("/:id", getFile);

router.patch("/:id", renameFile);

router.delete("/:id", deleteFile);

export default router;

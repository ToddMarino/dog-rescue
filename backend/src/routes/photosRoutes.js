import express from "express";
import { getSignedUploadUrl } from "../controllers/photosController.js";

const router = express.Router();

router.post("/sign-upload", getSignedUploadUrl);

export default router;
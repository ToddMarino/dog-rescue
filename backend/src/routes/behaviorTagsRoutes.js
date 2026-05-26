import express from "express";
import { getBehaviorTags } from "../controllers/behaviorTagsController.js";

const router = express.Router();

router.get('/', getBehaviorTags);

export default router;
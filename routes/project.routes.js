import express from "express";
const router = express.Router();

router.use(express.json());
import {
  createProject,
  getProjects,
} from "../controllers/project.controllers.js";

router.post("/", createProject);
router.get("/", getProjects);

export default router;

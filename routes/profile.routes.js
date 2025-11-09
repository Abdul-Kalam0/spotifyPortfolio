import express from "express";
const router = express.Router();

router.use(express.json());
import {
  createProfile,
  getProfile,
} from "../controllers/profile.controllers.js";

router.post("/profile", createProfile);
router.get("/profile", getProfile);

export default router;

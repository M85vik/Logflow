import express from "express";
import Project from "../models/projectModel.js";
import { generateApiKey } from "../utils/generateApiKey.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const apiKey = generateApiKey();

    const project = await Project.create({
      name: req.body.name,
      apiKey
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
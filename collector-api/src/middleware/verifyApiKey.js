import Project from "../models/projectModel.js";

export async function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      error: "Missing API key"
    });
  }

  const project = await Project.findOne({ apiKey });

  if (!project) {
    return res.status(401).json({
      error: "Invalid API key"
    });
  }

  req.project = project;
  next();
}
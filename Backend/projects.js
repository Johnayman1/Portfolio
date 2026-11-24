const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  brief: {
    type: String,
    required: true,
    minlength: 10,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  technology: {
    type: [String],
    required: true,
  },
  githubRepo: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Projects = mongoose.model("Projects", projectSchema);

router.get("/", async (req, res) => {
  try {
    const myProjects = await Projects.find({
      isDeleted: false,
    });
    res.status(200).json(myProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { project } = req.body;
    const newProject = await Projects.create({
      name: project.name,
      brief: project.brief,
      description: project.description,
      technology: project.technology,
      githubRepo: project.githubRepo,
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { project } = req.body;
    const updatedData = await Projects.findByIdAndUpdate(
      req.params.id,
      {
        name: project.name,
        brief: project.brief,
        description: project.description,
        technology: project.technology,
        githubRepo: project.githubRepo,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Project data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedData = await Projects.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      { new: true },
    );
    console.log("deleted");

    if (!deletedData) {
      return res.status(404).json({ message: "Project data not found" });
    }

    res.status(200).json(deletedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

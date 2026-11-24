const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const aboutSchema = new mongoose.Schema({
  brief: {
    type: String,
    required: true,
    minlength: 20,
  },
  education: {
    faculty: { type: String, required: true, minlength: 5 },
    degree: { type: String, required: true, minlength: 5 },
    graduationYear: { type: Number, default: 2027 },
  },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: String,
  description: String,
});

const About = mongoose.model("About", aboutSchema);
const Experience = mongoose.model("Experience", experienceSchema);

router.get("/", async (req, res) => {
  try {
    const myData = await About.findOne();
    res.status(200).json(myData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { brief, education } = req.body;
    const homeContent = await About.create({ brief, education });
    res.status(201).json(homeContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const { brief, education } = req.body;
    const updatedData = await About.findOneAndUpdate(
      {},
      { brief, education },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedData) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedData = await About.findByIdAndDelete(req.params.id);

    if (!deletedData) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.status(200).json(deletedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/experience", async (req, res) => {
  try {
    const myData = await Experience.findOne();
    res.status(200).json(myData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/experience", async (req, res) => {
  try {
    const { experience } = req.body;
    const homeContent = await Experience.create(experience);
    res.status(201).json(homeContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/experience/:id", async (req, res) => {
  try {
    const { experience } = req.body;
    const updatedData = await Experience.findByIdAndUpdate(
      req.params.id,
      experience,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedData) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/experience/:id", async (req, res) => {
  try {
    const deletedData = await Experience.findByIdAndDelete(req.params.id);

    if (!deletedData) {
      return res.status(404).json({ message: "About data not found" });
    }

    res.status(200).json(deletedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

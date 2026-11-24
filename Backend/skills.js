const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    enum: ["Programming", "Framework", "Database", "Tool"],
  },

  order: {
    type: Number,
    default: 0,
  },
});

skillSchema.index({ name: 1, category: 1 }, { unique: true });

const Skill = mongoose.model("Skill", skillSchema);

const categories = ["Programming", "Framework", "Database", "Tool"];

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (category && !categories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    const filter = category ? { category } : {};

    const skills = await Skill.find(filter).sort({ order: 1, name: 1 });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { skill } = req.body;

    const newSkill = await Skill.create({
      name : skill.name,
      category : skill.category,
      order : skill.order,
    });

    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const { skill } = req.body;

    const updates = {};
    if (skill.name !== undefined) updates.name = skill.name;
    if (skill.category !== undefined) updates.category = skill.category;
    if (skill.order !== undefined) updates.order = skill.order;

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSkill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);

    if (!deletedSkill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
      data: deletedSkill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

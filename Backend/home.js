const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    required: true,
    minlength: 10,
  },
  tagline: {
    type: String,
    required: true,
    minlength: 20,
  },
  numberOfProjects: {
    type: Number,
    default: 0,
    required: true,
  },
  numberOfTechnolgy: {
    type: Number,
    default: 1,
    required: true,
  },
  futureFocus: {
    type: String,
    default: "AI",
    required: true,
  },
  cv: {
    type: String,
    default: "",
    required: true,
  },
  socialLinks: {
    email: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
  },
  photo: {
    type: String,
    default: "",
  },
});

const Home = mongoose.model("home", homeSchema);
const upload = require("./config/upload");
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  const myData = await Home.findOne();
  res.status(200).json(myData);
});

router.post("/", async (req, res) => {
  const {
    name,
    role,
    tagline,
    numberOfProjects,
    numberOfTechnolgy,
    futureFocus,
    cv,
    socialLinks,
    photo
  } = req.body;
  const homeContent = await Home.create({
    name,
    role,
    tagline,
    numberOfProjects,
    numberOfTechnolgy,
    futureFocus,
    cv,
    socialLinks,
    photo
  });
  res.status(201).json(homeContent);
});

router.put("/", async (req, res) => {
  const {
    name,
    role,
    tagline,
    numberOfProjects,
    numberOfTechnolgy,
    futureFocus,
    cv,
    socialLinks,
  } = req.body;
  const myStudent = await Home.findOneAndUpdate(
    {},
    {
      name,
      role,
      tagline,
      numberOfProjects,
      numberOfTechnolgy,
      futureFocus,
      cv,
      socialLinks,
    },
    { new: true },
  );
  res.status(201).json(myStudent);
});



router.put("/home/photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a photo"
      });
    }

    const home = await Home.findOne();

    if (!home) {
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        message: "Home data not found"
      });
    }

    const oldPhoto = home.photo;

    home.photo = req.file.filename;
    await home.save();

    if (oldPhoto) {
      const oldPath = path.join(
        __dirname,
        "../uploads",
        oldPhoto
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    res.status(200).json(home);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/", async (req, res) => {
  const myStudent = await Home.deleteOne();
  res.status(201).json(myStudent);
});

module.exports = router;

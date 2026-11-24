const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/portfolio").then((err) => {
  console.log("Database connected");
});

const homeRoute = require("./home");
const aboutRoute = require("./about");
const projectsRoute = require("./projects");
const skillsRoute = require("./skills");
// const contactRoute = require("./contact")

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", homeRoute);
app.use("/api/about", aboutRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/skills", skillsRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => console.log("Server Started"));

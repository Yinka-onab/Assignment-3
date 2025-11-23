const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// READ — list events sorted by earliest first
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.render("events", { title: "Events", events });
});

// CREATE — show form
router.get("/add", (req, res) => {
  res.render("add", { title: "Add Event" });
});

// CREATE — submit
router.post("/add", async (req, res) => {
  await Event.create(req.body);
  res.redirect("/events");
});

// EDIT — show form
router.get("/edit/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("edit", { title: "Edit Event", event });
});

// EDIT — submit
router.post("/edit/:id", async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/events");
});

// DELETE
router.post("/delete/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect("/events");
});

module.exports = router;

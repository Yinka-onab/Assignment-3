const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Middleware to protect routes (Step 6 requirement)
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");   // redirect unauthenticated users
}

// READ — public page showing all events sorted earliest → latest
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.render("events", { title: "Events", events });
});

// CREATE — show form (PROTECTED)
router.get("/add", requireAuth, (req, res) => {
  res.render("add", { title: "Add Event" });
});

// CREATE — submit (PROTECTED)
router.post("/add", requireAuth, async (req, res) => {
  await Event.create(req.body);
  res.redirect("/events");
});

// EDIT — show form (PROTECTED)
router.get("/edit/:id", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("edit", { title: "Edit Event", event });
});

// EDIT — submit (PROTECTED)
router.post("/edit/:id", requireAuth, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/events");
});

// DELETE — (PROTECTED)
router.post("/delete/:id", requireAuth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.redirect("/events");
});

module.exports = router;

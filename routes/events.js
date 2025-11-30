const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Middleware to protect routes
function requireAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl;   // go back after login
  return res.redirect("/login");
}

/* ============================================
   READ — PUBLIC PAGE (anyone can see events)
   Sorted from earliest -> latest
============================================= */
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 }).lean();
  res.render("events", { title: "Events", events });
});

/* ============================================
   CREATE — SHOW FORM (AUTH REQUIRED)
============================================= */
router.get("/add", requireAuth, (req, res) => {
  res.render("add", { title: "Add Event" });
});

/* ============================================
   CREATE — SUBMIT (AUTH REQUIRED)
   Save the logged-in user as the owner
============================================= */
router.post("/add", requireAuth, async (req, res) => {
  const eventData = {
    title: req.body.title,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    owner: req.user._id   // store who created the event
  };

  await Event.create(eventData);
  res.redirect("/events");
});

/* ============================================
   EDIT — SHOW FORM (AUTH + OWNER CHECK)
============================================= */
router.get("/edit/:id", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id).lean();
  if (!event) return res.redirect("/events");

  // Owner-only protection
  if (event.owner && event.owner.toString() !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized: You do not own this event.");
  }

  res.render("edit", { title: "Edit Event", event });
});

/* ============================================
   EDIT — SUBMIT (AUTH + OWNER CHECK)
============================================= */
router.post("/edit/:id", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.redirect("/events");

  // Check owner
  if (event.owner && event.owner.toString() !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized: You do not own this event.");
  }

  // Update
  await Event.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description
  });

  res.redirect("/events");
});

/* ============================================
   DELETE — (AUTH + OWNER CHECK)
============================================= */
router.post("/delete/:id", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.redirect("/events");

  if (event.owner && event.owner.toString() !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized: You do not own this event.");
  }

  await Event.findByIdAndDelete(req.params.id);
  res.redirect("/events");
});

module.exports = router;


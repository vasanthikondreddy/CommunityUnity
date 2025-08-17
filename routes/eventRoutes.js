const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  createSignup
} = require("../controllers/eventController");


router.post("/", createEvent);
router.get("/", getAllEvents);
router.post("/:eventId/signups", createSignup);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  registerVolunteer,
  getAllVolunteers,
} = require("../controllers/volunteerController");

router.post("/", registerVolunteer);
router.get("/", getAllVolunteers);

module.exports = router;

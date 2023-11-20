import express from "express";
import {
  getDoctorsVisit,
  addDoctorsVisit,
  deleteDoctorsVisit,
  updateDoctorsVisit,
} from "../controllers/doctorsVisits.js";

const router = express.Router();

router.get("/", getDoctorsVisit);
router.post("/add", addDoctorsVisit);
router.delete("/:id", deleteDoctorsVisit);
router.put("/:id", updateDoctorsVisit);

export default router;

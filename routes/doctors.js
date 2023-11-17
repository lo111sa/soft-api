import express from "express";
import {
  getDoctors,
  getDoctor,
  addDoctor,
  deleteDoctor,
  updateDoctor,
} from "../controllers/doctors.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctor);
router.post("/add", addDoctor);
router.delete("/:id", deleteDoctor);
router.put("/:id", updateDoctor);

export default router;

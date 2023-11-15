import express from "express";
import {
  getPatients,
  getPatient,
  addPatient,
  deletePatient,
  updatePatient,
} from "../controllers/patient.js";

const router = express.Router();

router.get("/", getPatients);
router.get("/:id", getPatient);
router.post("/", addPatient);
router.delete("/:id", deletePatient);
router.put("/:id", updatePatient);

export default router;

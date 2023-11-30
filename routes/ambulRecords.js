import express from "express";
import {
  getDoctorsVisit,
  getAmb,
  addAmbulRecords,
  deleteAmbulRecords,
  updateAmbulRecords,
} from "../controllers/ambulRecords.js";

const router = express.Router();

router.get("/", getDoctorsVisit);
router.get("/getAmb", getAmb);
router.post("/add", addAmbulRecords);
router.delete("/:id", deleteAmbulRecords);
router.put("/:id", updateAmbulRecords);

export default router;

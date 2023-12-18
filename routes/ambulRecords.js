import express from "express";
import {
  getAmb,
  addAmbulRecords,
  updateAmbulRecords,
} from "../controllers/ambulRecords.js";

const router = express.Router();

//router.get("/", getDoctorsVisit);
router.get("/getAmb", getAmb);
router.post("/add", addAmbulRecords);
//router.delete("/:id", deleteAmbulRecords);
router.put("/:id", updateAmbulRecords);

export default router;

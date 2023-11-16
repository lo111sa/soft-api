import express from "express";
import {
  getDoctorsGroups,
  getDoctorsGroup,
  addDoctorsGroup,
  deleteDoctorsGroup,
  updateDoctorsGroup,
} from "../controllers/doctorsGroup.js";

const router = express.Router();

router.get("/", getDoctorsGroups);
router.get("/:id", getDoctorsGroup);
router.post("/add", addDoctorsGroup);
router.delete("/:id", deleteDoctorsGroup);
router.put("/:id", updateDoctorsGroup);

export default router;

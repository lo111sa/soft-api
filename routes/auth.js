import express from "express";
import { register, login, logout, checkAuth } from "../controllers/auth.js";
import verifyAuth from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", verifyAuth, checkAuth);
router.post("/logout", logout);

export default router;

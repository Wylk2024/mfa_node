import express from "express";
import { register, login, enableMFA } from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/enable-mfa", auth, enableMFA);

export default router;
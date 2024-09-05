import express from "express";
import { register , login,logout } from "../controllers/auth.js";
import  {authenticateToken}from"../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/verifytoken", authenticateToken, (req, res) => {
    // Si authenticateToken passe, ça veut dire que le token est valide
    res.status(200).json({ valid: true });
  });
  


export default router
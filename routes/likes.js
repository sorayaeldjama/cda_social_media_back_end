import express from "express";
import { getLikes, addLike,  } from "../controllers/like.js";

const router = express.Router()
router.get("/", getLikes)
router.post("/", addLike)


export default router
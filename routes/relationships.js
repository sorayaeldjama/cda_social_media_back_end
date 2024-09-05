import express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationships.js";
import  {authenticateToken}from"../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/",authenticateToken, getRelationships)
router.post("/", authenticateToken,addRelationship)
router.delete("/", authenticateToken,deleteRelationship)


export default router
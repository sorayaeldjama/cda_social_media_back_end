import express from "express";
import { getPosts,addPost,deletePost} from "../controllers/post.js";
import  {authenticateToken}from"../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/",authenticateToken,getPosts);
router.post("/",authenticateToken, addPost);
router.delete("/:id",authenticateToken, deletePost);


export default router
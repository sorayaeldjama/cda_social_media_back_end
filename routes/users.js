import express from "express";
import { getUser ,updateUser} from "../controllers/user.js";

import {getAllUsersExceptCurrent} from "../controllers/users.js";
import  {authenticateToken}from"../middlewares/authMiddleware.js"
const router = express.Router()

router.get("/find/:userId",authenticateToken, getUser)
router.put("/", authenticateToken, updateUser);
router.get("/",authenticateToken,getAllUsersExceptCurrent)



export default router
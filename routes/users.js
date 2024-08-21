import express from "express";
import { getUser ,updateUser} from "../controllers/user.js";

import {getAllUsersExceptCurrent} from "../controllers/users.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/",getAllUsersExceptCurrent)


export default router
import express from "express";
import authenticate from "../Middleware/Middleware.js";
import userController from "../Controller/userController.js"



const router = express.Router()

// router.post("/login",userController.loginUser)

router.post("/user-login",userController.userLogin)

router.put("/change-password", authenticate,userController.changeUserPassword)

router.post('/logout',authenticate, userController.logout)

router.get("/me", authenticate, userController.getMe)

export default router;
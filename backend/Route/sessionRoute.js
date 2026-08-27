import express from "express"

import sessionController from "../Controller/sessionController.js"
import authenticate from "../Middleware/Middleware.js"


const router = express.Router()

router.get("/students/:studentId/sessions",authenticate,sessionController.upcomingSession)

router.patch("/sessions/:sessionId",authenticate,sessionController.updateSession)

router.delete("/sessions/:sessionId",authenticate,sessionController.deleteSession)

export default router;
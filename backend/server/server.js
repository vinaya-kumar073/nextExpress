import express from "express"
import dotenv from "dotenv"
import { connectDB } from "../config/db.js"
import sessionRoute from "../Route/sessionRoute.js"
import userRoute from "../Route/userRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(cors({
  origin:"http://localhost:3000",
  methods:['POST','GET','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization'],
  credentials:true
}))


app.use(express.json())
app.use(cookieParser())


app.use("/api",sessionRoute)
app.use("/api/auth",userRoute)

connectDB()

app.listen(PORT,()=>{
  console.log(`The server is running on ${PORT} port.`)
})

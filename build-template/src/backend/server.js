import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import saraAI from "./routes/saraAI.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", saraAI)

app.get("/", (req,res)=>{
res.send("TripCraft AI Server Running 🚀")
})

const PORT = process.env.PORT || 5050

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`)
})
import express from "express"
import OpenAI from "openai"

const router = express.Router()

const client = new OpenAI({
baseURL: "https://api.deepseek.com",
apiKey: process.env.DEEPSEEK_API_KEY
})

router.post("/sara-ai", async (req,res)=>{

const { message, trip } = req.body

try{

const completion = await client.chat.completions.create({

model:"deepseek-chat",

messages:[
{
role:"system",
content:`
You are SARA, the AI travel assistant of TripCraft.

Your goal:
Improve travel packages WITHOUT increasing price.

Add complimentary experiences such as:
• Free breakfast
• Airport pickup
• Sightseeing tour
• Travel insurance
• Late checkout
• Room upgrade

Your job is to convince the traveler that the package is valuable.

Respond in a friendly travel agent tone.
`
},

{
role:"user",
content:`
Trip details

Departure: ${trip.departure}
Destination: ${trip.destination}
Travelers: ${trip.travelers}
Dates: ${trip.departDate} to ${trip.returnDate}

User request:
${message}
`
}

]

})

res.json({
reply: completion.choices[0].message.content
})

}catch(err){

console.log(err)

res.status(500).json({
error:"AI server error"
})

}

})

export default router
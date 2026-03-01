const express = require("express")
const router = express.Router()

const Booking = require("../models/Booking")

router.post("/bookTrip", async (req,res)=>{

try{

const booking = new Booking(req.body)

await booking.save()

res.json({
success:true,
message:"Trip booked successfully"
})

}catch(err){

res.status(500).json({
success:false,
error:err.message
})

}

})

module.exports = router
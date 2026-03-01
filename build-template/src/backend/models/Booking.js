const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({

departure:String,
destination:String,
departDate:String,
returnDate:String,
travelers:Number,

flightPrice:Number,
hotelPrice:Number,

extras:[String],

totalPrice:Number,

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Booking",BookingSchema)
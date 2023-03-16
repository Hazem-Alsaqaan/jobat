const mongoose = require("mongoose")

const consultingSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
},{timestamps: true})

const consultingModel = mongoose.model("consulting", consultingSchema)
module.exports = consultingModel



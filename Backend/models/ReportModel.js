import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true,
        default: "Self"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hospital: {
        type: String,
        required: true,
    },
    dr: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    price: Number,
    note: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    analysis: {
        type: String,
        default: ""
    },
    systolic: String,
    diastolic: String,
    temp: String,
    sugar: String,
    height: Number,
    weight: Number
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
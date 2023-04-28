import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    cityName: { type: String, required: true },
    temperature: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    precipitation: { type: Number, required: true },
});

export const WeatherModel = mongoose.model("weather", weatherSchema);

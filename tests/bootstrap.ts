import "dotenv/config";
import mongoose from "mongoose";
import { App } from "../src/app.js";
import { WeatherController } from "../src/controllers/weather.controller.js";

if (process.env.DB_URL == null) {
    console.log("Cannot find mongodb url");
    process.exit(1);
}
const dbUrl = process.env.DB_URL;


export const app = new App([new WeatherController()], 5000);

async function setupDb() {
    await mongoose.connect(dbUrl);
    console.log("database connection established!");
}

beforeAll(async () => {
    await setupDb();
});

afterAll(async () => {
    await mongoose.disconnect();
});


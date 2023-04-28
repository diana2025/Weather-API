import { App } from "./app.js";
import mongoose from "mongoose";

import "dotenv/config";
import { WeatherController } from "./controllers/weather.controller.js";
import { seedData } from "./seedData.js";

if (process.env.DB_URL == null) {
    console.log("Cannot find mongodb url");
    process.exit(1);
}
const dbUrl = process.env.DB_URL;

let port: number = 5000;
if (process.env.PORT) {
    port = +process.env.PORT;
}

async function main() {
    await mongoose.connect(dbUrl);
    console.log("database connection established!");
    const app = new App([new WeatherController()], port);
    app.listen();

}

// use this for seeding database
//mongoose.connect(dbUrl).then(() => seedData())
main();

import { faker } from "@faker-js/faker";
import { randomInt } from "crypto";
import { WeatherModel } from "./model/weather.model.js";

export async function seedData() {
    for (let i = 0; i < 100; i++) {
        const cityName = faker.address.cityName();
        const temperature = randomInt(-40, 50);
        const windSpeed = randomInt(0, 150);
        const precipitation = randomInt(0, 100);
        const model = new WeatherModel({
            cityName,
            temperature,
            windSpeed,
            precipitation,
        });
        await model.save();
    }
}

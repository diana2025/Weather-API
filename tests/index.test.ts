import jest from "@jest/globals";
import supertest from "supertest";
const { test, describe, expect } = jest;
import { app } from "./bootstrap.js";

describe("weather routes", () => {
    test("GET /weather", async () => {
        let response = await supertest(app.app).get("/weather?page=1");
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
    });

    test("POST /weather", async () => {
        let response = await supertest(app.app).post("/weather").send({
            cityName: "testing",
            temperature: 35,
            windSpeed: 35,
            precipitation: 30,
        });
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
    });

    test("GET /weather/:cityName", async () => {
        let response = await supertest(app.app).get("/weather/testing");
        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.cityName).toEqual("testing");
        expect(response.body.temperature).toEqual(35);
        expect(response.body.windSpeed).toEqual(35);
        expect(response.body.precipitation).toEqual(30);
    });

    test("PATCH /weather/:cityName", async () => {
        let response = await supertest(app.app).patch("/weather/testing")
            .send({
                temperature: 15,
                windSpeed: 30,
                precipitation: 3,
            });
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
    });

    test("updated data is saved in database or not!", async () => {
        let response = await supertest(app.app).get("/weather/testing");
        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body.cityName).toEqual("testing");
        expect(response.body.temperature).toEqual(15);
        expect(response.body.windSpeed).toEqual(30);
        expect(response.body.precipitation).toEqual(3);
    })

    test("DELETE /weather", async () => {
        let response = await supertest(app.app).delete("/weather/testing");
        expect(response.status).toEqual(200);
    });
});

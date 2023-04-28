import { Controller } from "../controller.js";
import express, { NextFunction, Request, Response } from "express";
import { Exception } from "../exception.js";
import { WeatherModel } from "../model/weather.model.js";


// The `WeatherController` class contains five methods:
//
// 1. `get_city_names`: It gets the `page` parameter from the request query or uses the default value of 0. 
// It then retrieves a maximum of 10 weather data entries from the database, skips entries based on the page number, 
// and returns the `cityName` property of the entries as a JSON response.
//
// 2. `add_weather`: It creates a new `WeatherModel` instance with the request body data, saves the data to the database, and returns the saved data as a JSON response.
// 
// 3. `get_weather`: It retrieves the weather data of a specific city from the database based on the `cityName` parameter in the request URL. 
// If no data is found, it throws an exception with a 404 status code. Otherwise, it returns the retrieved data as a JSON response.
// 
// 4. `update_weather`: It creates a new `WeatherModel` instance with the `cityName` parameter from the request URL and the request body data. 
// It then validates the data, updates the weather data of the specified city in the database, and returns a JSON response with a success message.
// 
// 5. `delete_weather`:  It deletes the weather data of a specific city from the database based on the `cityName` parameter in the request URL. 
// If no data is found, it throws an exception with a 404 status code. Otherwise, it returns a JSON response with a success message.
// 
// The `WeatherController` class constructor sets up the various routes for the class methods using the `express.Router()` method. 
// The `get_weather`, `update_weather`, and `delete_weather` methods all have `:cityName` as part of their URL, which indicates that they expect a city name to be provided as a URL parameter. 
// The `add_weather` method expects weather data to be provided in the request body, and the `get_city_names` method does not expect any parameters.
// 
// In summary, the `WeatherController` class provides a RESTful API for creating, reading, updating, and deleting weather data for various cities.

export class WeatherController implements Controller {
    public path = "/weather";
    public router = express.Router();
    constructor() {
        this.router.get(`${this.path}/:cityName`, this.get_weather);
        this.router.patch(`${this.path}/:cityName`, this.update_weather);
        this.router.delete(`${this.path}/:cityName`, this.delete_weather);
        this.router.post(`${this.path}`, this.add_weather);
        this.router.get(`${this.path}`, this.get_city_names);
    }

    async get_city_names(req: Request, res: Response, next: NextFunction) {
        try {
            const perPage = 10;
            const page = Number(req.query.page || 0);
            let data = await WeatherModel.find({}, { cityName: 1, _id: 0 })
                .limit(perPage)
                .skip(perPage * page)
                .lean()
                .exec();
            res.json(data);
        } catch (e: any) {
            return next(e);
        }
    }

    async add_weather(req: Request, res: Response, next: NextFunction) {
        try {
            const data = new WeatherModel(req.body);
            await data.save();
            res.json(data);
        } catch (e: any) {
            return next(e);
        }
    }

    async get_weather(req: Request, res: Response, next: NextFunction) {
        try {
            const cityName = String(req.params.cityName);
            let data = await WeatherModel.findOne(
                { cityName: cityName },
                { _id: 0 }
            )
                .lean()
                .exec();
            if (!data) {
                throw new Exception(404, `{cityName} not found in database`);
            }
            res.json(data);
        } catch (e: any) {
            return next(e);
        }
    }

    async update_weather(req: Request, res: Response, next: NextFunction) {
        try {
            const data = new WeatherModel({
                cityName: String(req.params.cityName),
                ...req.body,
            });
            let error = data.validateSync();
            if (error) {
                throw new Exception(422, "body doesn't contain whole data!");
            }
            let oldData = await WeatherModel.findOne({
                cityName: data.cityName,
            }).exec();
            if (!oldData) {
                throw new Exception(
                    404,
                    "cityName doesnt't exist in database cannot do patch!"
                );
            }
            oldData.temperature = data.temperature;
            oldData.windSpeed = data.windSpeed;
            oldData.precipitation = data.precipitation;
            await oldData.save();
            res.json({ message: "updated!" });
        } catch (e: any) {
            return next(e);
        }
    }

    async delete_weather(req: Request, res: Response, next: NextFunction) {
        try {
            const cityName = String(req.params.cityName);
            const mongoRes = await WeatherModel.deleteOne({
                cityName: cityName,
            }).exec();
            if (mongoRes.deletedCount == 0) {
                throw new Exception(404, `${cityName} not found!`);
            }
            res.json({ message: "successful" });
        } catch (e: any) {
            return next(e);
        }
    }
}

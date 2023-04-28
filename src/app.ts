import express from "express";
import cors from "cors";
import { Controller } from "./controller.js";
import errorMiddleware from "./middleware/error.middleware.js";
import { rateLimitter } from "./middleware/rateLimiter.middleware.js";

export class App {
    public app : express.Application;
    public port : number;
    constructor(controllers : Controller[], port : number) {
        this.app  = express();
        this.port = port;
        this.intializeMiddleWare();
        controllers.forEach((x) => {
            this.app.use("/", x.router);
        })
        this.app.use(errorMiddleware);
    }
    private intializeMiddleWare() {
        this.app.use(express.urlencoded({
            extended: true
        }));
        this.app.use(express.json());
        // only for testing
        this.app.use(cors());
        this.app.use(rateLimitter);
    }
    public listen() {
        this.app.listen(this.port, () => {
            console.log("App is listening on port ", this.port);
        })
    }
}

import { NextFunction, Request, Response } from "express";
import { Exception } from "../exception.js";

function errorMiddleware(
    error: any,
    _request: Request,
    response: Response,
    _next: NextFunction
) {
    if ( error instanceof Exception) {
        return response.status(error.status).send({
            ok: error.ok,
            message : error.message,
        })
    }
    const status = error.status || 500;
    const ok = error.ok || false;
    const message = error.message || "Something went wrong";
    response.status(status).send({
        ok,
        message,
    });
}

export default errorMiddleware;

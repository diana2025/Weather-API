import { NextFunction, Request, Response } from "express";
import { Exception } from "../exception.js";

const requestMap = new Map<string, RequestInfo>();

type RequestInfo = {
    timeStamps: Array<Date>,
}

// 100 request from a given ip per hour.
const rate = 100;

export function rateLimitter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const ip = req.socket.remoteAddress;
    if (!ip) {
        return next(new Exception(400, "Cannot get your ip address!"));
    }
    let info = requestMap.get(ip);
    if (info) {
        if (info.timeStamps.at(0)) {
            let first_req = info.timeStamps[0];
            if (first_req) {
                let difference = first_req.getTime() - new Date().getTime();
                if (difference / 1000 < 60 * 60 && info.timeStamps.length > rate) {
                    return next(new Exception(400, "you have exceeded the hourly rate limit"));
                }
                if (difference / 1000 > 60 * 60) {
                    info.timeStamps.splice(0, 1);
                }
            }
        }
        info.timeStamps.push(new Date());
    } else {
        requestMap.set(ip, { timeStamps: [new Date()] });
    }
    next()
}

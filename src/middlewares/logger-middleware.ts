import { NextFunction,Request,Response } from "express";

export default function loggerMiddleware(req:Request, res:Response, next:NextFunction){ {
    
    const time = new Date(Date.now()).toString();
    console.log(req.method,req.hostname, req.path, time);
    next();
}
}



import { NextFunction, Request, response, Response } from "express";
import responseHandler from "../helpers/response.helper";

export const tryCatch = (controller : any) => (req : Request, res : Response, next : NextFunction) => {
    try{
        controller(req, res,next)
    }catch(err : any){
        console.log('error here--->',err)
        return responseHandler(res, 500, null, err.message)
        next(err)
    }
}
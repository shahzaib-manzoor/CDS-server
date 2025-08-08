import { Response } from "express";

function responseHandler(res:Response, status:number, result:any, message:string | string[]) {
      return res.status(status).json({
          status,
          result,
          message: typeof(message) === 'string' ? message : message.map((msg) => msg)
      });
  }
  
   export default responseHandler;
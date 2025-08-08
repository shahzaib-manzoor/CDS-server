import { errorCode } from "../config/error.config";
import { NextFunction, Request, Response } from "express";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error Middleware---->', err);

  if (res.headersSent) {
    return next(err);
  }

  // Check if the error has a known error type
  const errorType = errorCode[err?.error_type];

  if (errorType) {
    res.status(errorType.status_code);
    return res.send({ message: errorType.message });
  }

  // Handle authentication errors
  if (err.error_type === "authentication_error") {
    return res.status(err.status_code).send({ message: err.message });
  } 

  // Default to 500 Internal Server Error
  res.status(500);
  res.send({ error: err.message || 'Internal Server Error' });
}

export default errorHandler;
import responseHandler from '..//helpers/response.helper';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => 
          `${issue.path.join('.')} is ${issue.message}`
        );
        responseHandler(res, 400, null, errorMessages);
      } else {
        responseHandler(res, 500, null, 'Internal Server Error');
      }
    }
  };
}
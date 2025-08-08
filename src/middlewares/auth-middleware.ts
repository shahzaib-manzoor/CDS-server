import { whileListRoutes } from "../config/route.config";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import { tryCatch } from "../utils/try-catch";
import { NextFunction, Request, Response } from "express";

const getTokenFromHeaders = (req: Request): string | null => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return null;
    return authorizationHeader.replace('Bearer ', '');
};

const isRouteWhitelisted = (url: string): boolean => {
    return whileListRoutes.includes(url);
};

const authMiddleware = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.url} body ====>`, req.headers);

    if (isRouteWhitelisted(req.url)) {
        
        return next();
    }

    const token = getTokenFromHeaders(req);
    if (!token) {
        return next(new AppError('Unauthorized', 401, 'authentication_error'));
    }

    const isVerified = await verifyToken(token);
    if (isVerified) {
        return next();
    } else {
        return next(new AppError('Unauthorized', 401, 'authentication_error'));
    }
});

export default authMiddleware;
import { getUserById } from "../services/user.services";
import { tryCatch } from "../utils/try-catch";
import { NextFunction, Request, Response } from "express";

export const getUser = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const resData = await getUserById(id, res, next);
        if (resData) {
            res.status(200).send(resData);
        }
    } catch (err) {
        next(err);
    }
});
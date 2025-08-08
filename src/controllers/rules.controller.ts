import { tryCatch } from "../utils/try-catch";
import { NextFunction, Request, Response } from "express";
import {Rules} from "../models/Rules.model";
import { ObjectId } from "mongodb";
import responseHandler from "../helpers/response.helper";

export const getRules = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const query = id ? { _id: new ObjectId(id) } : {};
    
    const rules = await Rules.findById(query);
    
   responseHandler(res, 200, rules, "Rules fetched successfully");
});


export const getRulesList = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.query;

    // Build the query object
    const query: any = {};
    if (status) {
        query.status = status;
    }

    // Fetch rules based on the query
    const rules = await Rules.find(query);

    responseHandler(res, 200, rules, "Rules fetched successfully");
});
export const createRule = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    const createdRules = await Rules.insertMany(data);
    
    responseHandler(res, 200, createdRules, "Rules created successfully");
});

export const updateRule = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;
    
    const updatedRules = await Rules.updateOne({ _id: new ObjectId(id) }, { $set: data });
    
    responseHandler(res, 200, updatedRules, "Rules updated successfully");
});
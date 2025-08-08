import { tryCatch } from "../utils/try-catch";
import { NextFunction, Request, Response } from "express";
import { DecisionForest } from "../models/Node.model";
import { ObjectId } from "mongodb";
import responseHandler from "../helpers/response.helper";
import parseCondition from "../utils/parseCondition";

export const getDecisionTrees = tryCatch(
      async (req: Request, res: Response, next: NextFunction) => {
      const decisionTrees = await DecisionForest.find().populate("nodes").exec();
      responseHandler(res, 200, decisionTrees, "DecisionTrees fetched successfully");
      }
      );
 
export const getDecisionTree = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const decisionTree = await DecisionForest
      .findById(id)
      .populate("nodes")
      .exec();

      responseHandler(res, 200, decisionTree, "DecisionTree fetched successfully");

      }
);

export const updateDecisionTree = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;

    const { nodesToAdd, nodesToRemove, ...otherData } = data;

    let updatedDecisionTree = await DecisionForest.findByIdAndUpdate(id, otherData, {
      new: true,
    }).exec();

    const updatePromises = [];

    if (nodesToAdd && nodesToAdd.length > 0) {
      updatePromises.push(
        DecisionForest.findByIdAndUpdate(id, {
          $addToSet: { nodes: { $each: nodesToAdd } },
        }, { new: true }).exec()
      );
    }

    if (nodesToRemove && nodesToRemove.length > 0) {
      updatePromises.push(
        DecisionForest.findByIdAndUpdate(id, {
          $pull: { nodes: { $in: nodesToRemove } },
        }, { new: true }).exec()
      );
    }

    if (updatePromises.length > 0) {
      const results = await Promise.all(updatePromises);
      updatedDecisionTree = results[results.length - 1];
    }

    responseHandler(res, 200, updatedDecisionTree, "DecisionTree updated successfully");
  }
);

export const createDecisionTree = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const createdDecisionTree = await DecisionForest.insertMany(data);

    responseHandler(res, 200, createdDecisionTree, "DecisionTree created successfully");
  }
);

export const deleteDecisionTree = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedDecisionTree = await DecisionForest.findByIdAndDelete(id).exec();

    responseHandler(res, 200, deletedDecisionTree, "DecisionTree deleted successfully");
  }
);

      
export default {

   getDecisionTrees,
      getDecisionTree,
      updateDecisionTree,
      createDecisionTree,
      deleteDecisionTree,
      };
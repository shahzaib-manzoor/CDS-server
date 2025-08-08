import { tryCatch } from "../utils/try-catch";
import { NextFunction, Request, Response } from "express";
import Node from "../models/Node.model";
import { ObjectId } from "mongodb";
import responseHandler from "../helpers/response.helper";
import updateConditionById from "../services/node.services";
import Edge from "../models/Edges.model";
export const getNodes = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    const query = id ? { rules: id } : {};
    const edges = await Edge.find(query).exec();  
    const nodes = await Node.find({rules:id}).exec();
    responseHandler(res, 200, {
      nodes,
      edges,
    }, "Nodes fetched successfully");
  }
);

export const createNode = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { nodes, ruleId, edges } = req.body;

    const nodeIds = nodes.map((nodeData: any) => nodeData.nodeId);
    const existingNodes = await Node.find({rules:ruleId}).exec();
    const existingNodeIds = existingNodes.map((node: any) => node.nodeId);
    const idsToRemove = existingNodeIds.filter((id) => !nodeIds.includes(id));

    if (idsToRemove.length > 0) {
      await Node.deleteMany({ nodeId: { $in: idsToRemove } }).exec();
    }
    if (edges) {
        await Edge.deleteMany({ rules: ruleId }).exec();
      }

      await Edge.insertMany(edges);
    
    const updatePromises = nodes.map((nodeData: any) => {
      const { nodeId, ...updateData } = nodeData;
      const data = {
        ...updateData,
        rules: ruleId,
      };
      return Node.findOneAndUpdate(
        { nodeId: nodeId },
        { $set: data },
        { new: true, upsert: true }
      ).exec();
    });

    const updatedNodes = await Promise.all(updatePromises);

    responseHandler(
      res,
      200,
      updatedNodes,
      "Nodes created or updated successfully"
    );
  }
);

export const updateCondition = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, conditionId } = req.params;
    const updatedCondition = req.body;

    const response = await updateConditionById(
      id,
      conditionId,
      updatedCondition
    );

    responseHandler(res, 200, response, "Condition updated successfully");
  }
);

export const getNode = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const node = await Node.findById(id).exec();

    responseHandler(res, 200, node, "Node fetched successfully");
  }
);

export const updateNode = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;

    const { conditions, ...otherData } = data;

    const updatedNode = await Node.findByIdAndUpdate(id, otherData, {
      new: true,
    }).exec();

    console.log("conditions", conditions);
    if (conditions && conditions.length > 0) {
      await Node.findByIdAndUpdate(id, {
        $push: { conditions: { $each: conditions } },
      }).exec();
    }

    responseHandler(res, 200, updatedNode, "Node updated successfully");
  }
);

export const deleteNode = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedNode = await Node.findByIdAndDelete(id).exec();

    responseHandler(res, 200, deletedNode, "Node deleted successfully");
  }
);
// export const decisionTreeSearch = tryCatch(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.query;
//     const { data } = req.body;

//     let currentNode = await Node.findById(id).exec();
//     if (!currentNode) {
//       return res.status(404).json({ message: "Node not found" });
//     }

//     while (true) {
//       const sortedConditions = currentNode.conditions.sort(
//         (a: any, b: any) => b.score - a.score
//       );

//       const matchedCondition = sortedConditions.find((condition: any) => {
//         const dataValue = data[condition.key];
//         if (dataValue !== undefined) {
//           switch (condition.expression) {
//             case ">":
//               return dataValue > condition.value;
//             case "<":
//               return dataValue < condition.value;
//             case ">=":
//               return dataValue >= condition.value;
//             case "<=":
//               return dataValue <= condition.value;
//             case "=":
//               return dataValue === condition.value;
//             case "!=":
//               return dataValue !== condition.value;
//             default:
//               throw new Error(
//                 `Unsupported expression: ${condition.expression}`
//               );
//           }
//         }
//         return false;
//       });

//       if (matchedCondition && matchedCondition.nextNode) {
//         console.log(currentNode);
//         currentNode = await Node.findById(matchedCondition.nextNode).exec();
//         if (!currentNode) {
//           return res.status(404).json({
//             message:
//               "Next node not found. The decision tree may be incomplete.",
//           });
//         }
//       } else {
//         break;
//       }
//     }

//     return res
//       .status(200)
//       .json({ message: "Node processed successfully", node: currentNode });
//   }
// );

const validateInputData = (
  inputs: { name: string }[],
  data: Record<string, any>
): { valid: boolean; missingKeys: string[] } => {
  const requiredKeys = inputs.map((input) => input.name);
  const missingKeys = requiredKeys.filter((key) => !(key in data));
  return {
    valid: missingKeys.length === 0,
    missingKeys,
  };
};

// Main function to search through the decision tree
export const decisionTreeSearch = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query; // Node ID from the query parameters
    const { data } = req.body; // Input data for evaluation

    try {
      // Fetch the current node
      const currentNode = await Node.findById(id).populate("rules").exec();
      if (!currentNode) {
        return res.status(404).json({ message: "Node not found" });
      }

      // Validate input data
      const validation = validateInputData(currentNode.inputs, data);
      if (!validation.valid) {
        return res.status(400).json({
          message: "Input data is missing required fields",
          requiredInputs: currentNode.inputs.map((input) => input.name),
          missingKeys: validation.missingKeys,
        });
      }

      const rule = currentNode.rules;

      // Sort conditions by score
      const sortedConditions = currentNode.conditions.sort(
        (a, b) => (b.score ?? 0) - (a.score ?? 0)
      );

      // Find the first condition that matches
      const matchedCondition = sortedConditions.find((condition) => {
        if (condition.key && condition.value && condition.expression) {
          const dataValue = data[condition.key];
          console.log("dataValue====>", dataValue);
          if (dataValue !== undefined) {
            switch (condition.expression) {
              case ">":
                return dataValue > condition.value;
              case "<":
                return dataValue < condition.value;
              case ">=":
                return dataValue >= condition.value;
              case "<=":
                return dataValue <= condition.value;
              case "=":
                return dataValue === condition.value;
              case "!=":
                return dataValue !== condition.value;
              default:
                throw new Error(
                  `Unsupported expression: ${condition.expression}`
                );
            }
          }
          return false;
        }
      });

      console.log("matchedCondition====>", matchedCondition);

      if (matchedCondition && matchedCondition.nextNode) {
        const nextNode = await Node.findById(matchedCondition.nextNode)
          .populate("rules")
          .exec();
        if (!nextNode) {
          return res.status(404).json({
            message:
              "Next node not found. The decision tree may be incomplete.",
          });
        }
        return res
          .status(200)
          .json({ message: "Next node found", node: nextNode });
      } else {
        return res.status(200).json({
          message: "No matching condition found",
          node: currentNode,
          rule,
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);
export default {
  getNodes,
  createNode,
  getNode,
  updateNode,
  deleteNode,
  decisionTreeSearch,
  updateCondition,
};

/*const evaluateCondition = (condition: any, dataValue: any): boolean => {
  switch (condition.expression) {
    case ">":
      return dataValue > condition.value;
    case "<":
      return dataValue < condition.value;
    case ">=":
      return dataValue >= condition.value;
    case "<=":
      return dataValue <= condition.value;
    case "=":
      return dataValue === condition.value;
    case "!=":
      return dataValue !== condition.value;
    default:
      throw new Error(`Unsupported expression: ${condition.expression}`);
  }
};

const getNextNode = async (id: string) => {
  const node = await Node.findById(id).exec();
  if (!node) {
    throw new Error("Node not found");
  }
  return node;
};

const decisionTreeSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.query;
    const { data } = req.body;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: "Invalid or missing node ID" });
    }

    let currentNode = await getNextNode(id);

    while (true) {
      const sortedConditions = currentNode.conditions.sort((a: any, b: any) => b.score - a.score);

      const matchedCondition = sortedConditions.find((condition: any) => {
        const dataValue = data[condition.key];
        return dataValue !== undefined && evaluateCondition(condition, dataValue);
      });

      if (matchedCondition && matchedCondition.nextNode) {
        currentNode = await getNextNode(matchedCondition.nextNode);
      } else {
        break;
      }
    }

    return res.status(200).json({ message: "Node processed successfully", node: currentNode });

  } catch (error) {
    if (error.message === "Node not found") {
      return res.status(404).json({ message: "Node not found" });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
*/

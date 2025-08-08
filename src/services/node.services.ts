import Node from "..//models/Node.model";

async function updateConditionById(nodeId: string, conditionId: string, updatedCondition: any) {
      try {
            console.log("nodeId", nodeId,conditionId, updatedCondition);
        const updatedNode = await Node.findOneAndUpdate(
          { _id: nodeId, "conditions._id": conditionId },
          {
            $set: {
              "conditions.$.key": updatedCondition.key,
              "conditions.$.expression": updatedCondition.expression,
              "conditions.$.value": updatedCondition.value,
              "conditions.$.nextNode": updatedCondition.nextNode,
              "conditions.$.score": updatedCondition.score,
            },
          },
          { new: true }
        ).exec();
    
            return updatedNode;
      } catch (error) {
         return error;
      }
    }

export default updateConditionById;
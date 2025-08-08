import mongoose from "mongoose";

const Schema = mongoose.Schema;

const edgeSchema = new Schema({
  edgeId: { type: String}, 
  source: { type: String, required: true },
  target: { type: String, required: true },
  sourceHandle: { type: String,  },
  sourceNode : { type: Schema.Types.ObjectId, ref: 'Node' },
  targetNode : { type: Schema.Types.ObjectId, ref: 'Node' },
  rules: { type: Schema.Types.ObjectId, ref: 'Rule' },

});


const Edge = mongoose.model("Edge", edgeSchema);

export default Edge;
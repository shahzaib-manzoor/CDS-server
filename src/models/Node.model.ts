import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema(
  {
    key: { type: String},
    expression: { type: String}, //logical expression
    value: { type: mongoose.Schema.Types.Mixed},
    // conditions: [yar
    //   {  
    //     key: { type: String, required: true },
    //     expression: { type: String, required: true }, //arithmetic expression
    //     value: { type: mongoose.Schema.Types.Mixed, required: true },
    //   },
    // ],
    nextNode: { type: mongoose.Schema.Types.ObjectId, ref: "Node" },
    score: { type: Number },  
  },
  { strict: false }
);

const InputSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const NodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    nodeId: { type: String, required: true },
    inputs: [InputSchema],
    outputs: [
      {type:mongoose.Schema.Types.Mixed}  
    ],
    isActive: { type: Boolean, default: true }, 
    rules: { type: mongoose.Schema.Types.ObjectId, ref: "Rules" },
    measured:{
      height:{ type:Number},
      width:{type:Number}
    },
    position:{
      x:Number,
      y:Number
    },
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Node" }],
    conditions: [conditionSchema],
    nextNodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Node" }],
    config:{type:mongoose.Schema.Types.ObjectId, ref:"CriteriaConfig"}
  },
  { timestamps: true,id:false }
);
const decisionForestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    nodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node",
      },
    ],
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DecisionForest = mongoose.model("DecisionForest", decisionForestSchema);

const Node = mongoose.model("Node", NodeSchema);
export { DecisionForest, Node };
export default Node;

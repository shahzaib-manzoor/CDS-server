import mongoose from "mongoose";

const Schema = mongoose.Schema;

const configSchema = new Schema({
    key: {
            type: String,
            required: true,
            unique: true,
    },
    type: {
            type: String,
            required: true,
      },
      })

const Config = mongoose.model("CriteriaConfig", configSchema);

export default Config;
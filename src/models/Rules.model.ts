import mongoose, { Schema } from 'mongoose';

 

const RulesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  status: {
    type: String,
    default: 'Active',
  }
 
}, { timestamps: true ,strict:false});

 

const Rules = mongoose.model('Rules', RulesSchema);

export { Rules };
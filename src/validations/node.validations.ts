import { z } from 'zod';

const conditionSchema = z.object({
  key: z.string().min(1, "Key is required"),
  expression: z.string().min(1, "Expression is required"),
  value: z.any().refine(val => val !== undefined, "Value is required"),
  nextNode: z.string().optional(), // Assuming ObjectId is a string
  score: z.number().min(0, "Score must be a non-negative number"),
});

const nodeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  numberOfInputs: z.number().min(1, "At least one input is required"),
  numberOfOutputs: z.number().min(1, "At least one output is required"),
  isActive: z.boolean().optional(),
  rules: z.string().optional(), // Assuming ObjectId is a string
  branches: z.array(z.string()).optional(), // Assuming ObjectId is a string
  conditions: z.array(conditionSchema).optional(),
});

const decisionForestSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  nodes: z.array(nodeSchema).optional(),
  enabled: z.boolean().optional(),
});

export default {
  nodeSchema,
  decisionForestSchema,
};
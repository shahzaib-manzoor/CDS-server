import { z } from 'zod';

export const rulesSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
  numberOfInputs: z.number().min(1, "At least one input is required"),
  numberOfOutputs: z.number().min(1, "At least one output is required"),
});



export default {
  rulesSchema,
};
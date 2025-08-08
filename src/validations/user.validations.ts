import {z} from 'zod';

export const userRegistrationSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/, 'Invalid Format'),
    username: z.string().min(3).max(50)
    // Add more validation rules for other fields
});

export const userLoginSchema = z.object({
    password: z.string(),
    username: z.string().min(3).max(50)
    // Add more validation rules for other fields
});

export const changePasswordSchema = z.object({
    newPassword: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/, 'Invalid Format'),
    token: z.string()
    // Add more validation rules for other fields
});

export const resetEmailSchema = z.object({
    email: z.string().email(),
    // Add more validation rules for other fields
});

export const getUsersSchema = z.object({
    pageNumber: z.string()
});

export default {
    userRegistrationSchema,
    userLoginSchema,
    changePasswordSchema,
    resetEmailSchema,
    getUsersSchema
};
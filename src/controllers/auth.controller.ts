import responseHandler from "../helpers/response.helper";
import { resetPassword, signup, userLogin, changePassword as changePasswordService } from "../services/user.services";
import { NextFunction, Request, Response } from "express";

function removeCircularReferences(obj: any) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    }));
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const token = await userLogin(username, password, res, next);
        responseHandler(res, 200, removeCircularReferences(token), "User logged in successfully");
    } catch (err) {
        if (!res.headersSent) {
            next(err);
        }
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    try {
        const val = await signup(user, res, next);
        responseHandler(res, 200, removeCircularReferences(val), "User created successfully");
    } catch (err) {
        if (!res.headersSent) {
            next(err);
        }
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;
    try {
        const resData = await changePasswordService(token, newPassword, res, next);
        responseHandler(res, 200, removeCircularReferences(resData), "Password changed successfully");
    } catch (err) {
        if (!res.headersSent) {
            next(err);
        }
    }
};

export const passwordReset = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const resData = await resetPassword(email, res, next);
        responseHandler(res, 200, removeCircularReferences(resData), "Password reset email sent");
    } catch (err) {
        if (!res.headersSent) {
            next(err);
        }
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { tokenId } = req.body;
    // Implement the refresh token logic here
    // Example:
    // try {
    //     const newToken = await auth0.refreshToken(tokenId);
    //     responseHandler(res, 200, removeCircularReferences(newToken), "Token refreshed successfully");
    // } catch (err) {
    //     if (!res.headersSent) {
    //         next(err);
    //     }
    // }
};
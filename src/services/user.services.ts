import Users from "../models/Users.model";
import AppError from "../utils/AppError";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import MailUtil from "../utils/nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import responseHandler from "../helpers/response.helper";

const mailer = new MailUtil();

export const signup = async (user: any, res: Response, next: NextFunction) => {
  try {
    const exist = await Users.findOne({ email: user?.email });
    if (exist) {
      return responseHandler(res, 409, null, "User already exists");
    }

    const hash = await hashPassword(user.password);
    const newUser = new Users({
      email: user.email,
      password: hash,
      username: user.username,
      profile_url: "",
      role: "",
      name: user.name,
      verified: false,
    });

    const userData = await newUser.save();
    mailer.sendEmail("shahzi113awan@gmail.com");
    console.log("User data====>", userData);
    return responseHandler(res, 201, userData, "User created successfully");
  } catch (err) {
    next(err);
  }
};

export const  userLogin = async (username: string, password: string, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findOne({
      $or: [{ username: username }, { email: username }],
    });
    if (!user) {
      return responseHandler(res, 400, null, "User not found");
    }

    const matched = await verifyPassword(password, user.password);
    if (!matched) {
      return responseHandler(res, 401, null, "Wrong email/password");
    }

    const token = await generateToken({
      username: user?.username,
      email: user.email,
      id: user._id,
    });

    return responseHandler(res, 200, { token }, "Login successful");
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (email: string, res: Response, next: NextFunction) => {
  try {
    const exist = await Users.findOne({ email: email });
    if (!exist) { 
      return responseHandler(res, 401, null, "User does not exist");
    }

    await mailer.resetPasswordEmail(email);
    return responseHandler(res, 200, null, "Password reset email sent");
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (token: string, newPassword: string, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(
      token,
      `${process.env.CLIENT_SECRET}`
    ) as JwtPayload;
    if (!decoded) {
      return responseHandler(res, 401, null, "Invalid token");
    }

    console.log('decoded====>', decoded);
    const { email } = decoded.data;
    console.log('email====>', email);
    const user = await Users.findOne({ email: email });
    if (!user) {
      return responseHandler(res, 404, null, "User not found");
    }

    const hash = await hashPassword(newPassword);
    user.password = hash;
    await user.save();
    return responseHandler(res, 200, null, "Password reset successfully");
  } catch (err) {
    next(err);
  }
};

export const getUserByEmail = async (email: string, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findOne({ email: email }).exec();
    if (!user) {
      return responseHandler(res, 404, null, "User not found");
    }
    return responseHandler(res, 200, user, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (id: string, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findById(id).exec();
    if (!user) {
      return responseHandler(res, 404, null, "User not found");
    }
    return responseHandler(res, 200, user, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};
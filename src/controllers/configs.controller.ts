import { Request, Response, NextFunction } from "express";
import Config from "../models/Configs.model";
import responseHandler from "../helpers/response.helper";

// Create a new configuration
export const createConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const configData = req.body;
        const newConfig = new Config(configData);
        const savedConfig = await newConfig.save();
        responseHandler(res, 201, savedConfig, "Configuration created successfully");
    } catch (err) {
        if (err.code === 11000) {
            responseHandler(res, 400, null, "Duplicate key error: A configuration with this key already exists.");
        } else {
            next(err);
        }
    }
};
 
// Get all configurations 
export const getAllConfigs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const configs = await Config.find();
        responseHandler(res, 200, configs, "Configurations fetched successfully");
    } catch (err) {
        responseHandler(res, 400, null, err.message);
    }
};
// Get a single configuration by ID
export const getConfigById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const config = await Config.findById(id);
        if (!config) {
            return res.status(404).send({ message: "Configuration not found" });
        }
        responseHandler(res, 200, config, "Configuration fetched successfully");
    } catch (err) {
        responseHandler(res, 400, null, err.message);
    }
};

// Update a configuration by ID
export const updateConfigById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedConfig = await Config.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedConfig) {
            return res.status(404).send({ message: "Configuration not found" });
        }
        responseHandler(res, 200, updatedConfig, "Configuration updated successfully");
    } catch (err) {
        if (err.code === 11000) {
            responseHandler(res, 400, null, "Duplicate key error: A configuration with this key already exists.");
        } else {
            next(err);
        }
    }
};

// Delete a configuration by ID
export const deleteConfigById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedConfig = await Config.findByIdAndDelete(id);
        if (!deletedConfig) {
            return res.status(404).send({ message: "Configuration not found" });
        }
        responseHandler(res, 200, deletedConfig, "Configuration deleted successfully");
    } catch (err) {
        next(err);
    }
};
import {Request, Response} from "express";
import {Logger} from "logger-colors";
import {GenericResponse} from "../Models/Interfaces/GenericResponse";

const User = require("../Models/Mongo/User");

export class UserController {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public async createUser(userBody: any): Promise<any> {
        try {
            let mongoUser;
            if (userBody._id) {
                mongoUser = await User.findById(userBody._id);
                mongoUser.overwrite(userBody);
            } else
                mongoUser = new User(userBody);
            await mongoUser.save();
            return mongoUser;
        } catch (e) {
            throw e;
        }
    }

    public async getAllUser(): Promise<any> {
        let users = [];
        try {
            users = await User.find();
        } catch (e) {
            console.error(e);
        } finally {
            return users;
        }
    }
}

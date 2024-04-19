import express, {NextFunction, Request, Response, Router} from "express";
import {Logger} from "logger-colors";
import {LoggerRequest} from "../Tools/Logger/LoggerRequest";
import {sendResponse} from "../Tools/Logger/SendResponse";
import {GenericResponse} from "../Models/Interfaces/GenericResponse";
import {UserController} from "../Controller/UserController";

export function GetUserRoutes(): Router {
    const loggerCfg = {
        ...JSON.parse(process.env.LOGGER),
        operationId: '/user'
    }

    const logger = new Logger(loggerCfg);
    const loggerOptions = LoggerRequest({
        logger,
        smallJsonOptions: {
            protectKeys: [],
            symbolProtection: ''
        }
    })
    const router = express.Router();
    const userController = new UserController(logger);

    router.get("/", [loggerOptions, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let gResponse: GenericResponse;
        try {
            let users = await userController.getAllUser();
            gResponse = {
                Success: true,
                Message: "Success getting data",
                Response: users
            }
            res.status(200);
        } catch (e) {
            gResponse = {
                Success: false,
                Message: "Error getting all users"
            }
            res.status(500);
        } finally {
            sendResponse(logger, gResponse, res);
        }
    }]);

    router.post("/", [loggerOptions, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let gResponse: GenericResponse;
        try {
            let states = await userController.createUser(req.body);
            gResponse = {
                Success: true,
                Message: "Success saving data",
                Response: states
            }
            res.status(200);
        } catch (e) {
            gResponse = {
                Success: false,
                Message: "Error saving all states"
            }
            res.status(500);
        } finally {
            sendResponse(logger, gResponse, res);
        }
    }]);

    return router;
}


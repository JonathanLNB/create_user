import {LColor, Logger} from "logger-colors";
import {GenericResponse} from "../../Models/Interfaces/GenericResponse";
import {Response} from "express";

export function sendResponse(logger: Logger, response: GenericResponse, res: Response) {
    if (response.Success) {
        logger.magenta('RESPONSE', true);
        logger.magenta(`STATUS: ${LColor.c_magenta}[${res.statusCode}]`, false);
        logger.magenta(`BODY:`, false);
        logger.magenta(JSON.stringify(response), false);
    } else {
        logger.error('RESPONSE', true);
        logger.error(`STATUS: ${LColor.c_red}[${res.statusCode}]`, false);
        logger.error(`BODY:`, false);
        logger.error(JSON.stringify(response), false);
    }
    res.send(response);
}

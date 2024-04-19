import {Request, Response} from "express";
import {Logger, LColor} from 'logger-colors';
import {SmallJSON, SmallJsonOptions} from './SmallJson';

const separador = '----------------------------------------------------';

export interface LoggerRequestOptions {
    smallJsonOptions?: SmallJsonOptions;
    logger?: Logger;
}


/*
 * Middleware que se encarga de imprimir los datos de una
 * petición de express. Esta función recibe opciones y retorna
 * una función middleware de express la cual no modifica
 * de ninguna forma el request y el response
 */

// export function LoggerRequest(keys?: [any]) {
export function LoggerRequest(options?: LoggerRequestOptions) {
    let logger: any;
    const opt: LoggerRequestOptions = {
        smallJsonOptions: null,
        logger: null,
    };

    const opts = {...opt, ...options};

    if (!opts.logger) {
        logger = new Logger();
    } else {
        logger = opts.logger;
    }

    const smalljson = SmallJSON(opts.smallJsonOptions);

    return (req: Request, res: Response, next: () => void) => {
        logger.info(separador);
        logger.cyan('REQUEST', true);
        logger.cyan('METHOD:\t' + req.method, false);
        logger.cyan('URL:   \t' + req.originalUrl, false);
        logger.cyan('HEADERS:', false);
        Object.keys(req.headers).forEach((h) => {
            logger.cyan('- ' + h + ": " + LColor.c_white + req.headers[h] + LColor.c_cyan, false);
            // logger.cyan(h + ":\t" + req.headers[h], false);
        });
        // logger.cyan(JSON.stringify(req.headers, smalljson), false);
        logger.cyan('', false);
        logger.cyan('BODY:', false);
        logger.cyan(JSON.stringify(req.body, smalljson), false);
        logger.info(separador);
        next();
    };

}

export function smallJsonBody(keys?: any[]) {
    let noFullHeaders = {};
    if (keys && keys.length) {
        noFullHeaders = {
            smallJsonOptions: {
                protectKeys: keys,
                symbolProtection: '',
            },
        };
    }
    let logger: any;
    const options = noFullHeaders || {} as LoggerRequestOptions;
    const opt: LoggerRequestOptions = {
        smallJsonOptions: null,
        logger: null,
    };

    const opts = {...opt, ...options};

    if (!opts.logger) {
        logger = new Logger();
    } else {
        logger = opts.logger;
    }

    return SmallJSON(opts.smallJsonOptions);
}


import jwt from "jwt-simple";
import moment from "moment";
import 'dotenv/config'
import {User} from "../Models/Entities/User";
import IAuthResponse from "../Interfaces/IAuthResponse";
import IAuthPayload from "../Interfaces/IAuthPayload";

export function GetUnauthorizedResponse(req, res, next): IAuthResponse {
    return req.auth ? {
        Success: false,
        Message: `Invalid credentials: ${req.auth.user}:${req.auth.password}`
    } : {Success: false, Message: `Credentials were not provided`};
}

export function IsAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            Success: false,
            Message: `Unauthorized`
        });
    }
    const token = req.headers.authorization.split(" ")[1];
    DecodeToken(token).then(response => {
        req.user = response;
        next();
    }).catch(response => res.status(response.Status).json({Success: false, Message: response.Message}));

}

function DecodeToken(token: string) {
    return new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, process.env.JWT_SECRET_TOKEN, false);
            resolve(payload);
        } catch (e) {
            reject({
                Status: 401,
                Message: 'Token expired'
            })
        }
    });
}

export function CreateToken(user: User): string {
    const payload: IAuthPayload = {
        iat: moment().unix(),
        user: user,
        exp: moment().add(12, 'hours').unix()
    };
    return jwt.encode(payload, process.env.JWT_SECRET_TOKEN);
}

module.exports = {GetUnauthorizedResponse, IsAuth, CreateToken}

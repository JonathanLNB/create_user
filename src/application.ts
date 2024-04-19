import 'dotenv/config'
import {Application, Router} from "express";
import express = require("express");
import cors from 'cors';
import {connect} from "mongoose"
import {NotFound, ErrorHandler} from './middleware/handler';
import {GetUserRoutes} from "./Routes/UserRouter";
import pkg from "../package.json";


export class App {
    public app: Application;
    private router: Router;

    constructor(private port: number, routes: Array<express.Router>, private apiPath: string = '/api', private staticPath: string = "public") {
        this.server();
        this.cors();
        this.database().then(() => {
            //* Method calls `this.app.use()` for each router, prepending `this.apiPath` to each router
            //* Method calls `this.app.use(express.static(path))` to enable public access to static files
            this.routes();

            this.app.use(NotFound);
            this.app.use(ErrorHandler);
            console.log("System intialized");
        });

        this.cors();


    }

    private server() {
        this.app = express();
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb', extended: true}));
    }

    private routes() {
        this.app.use("/api/user", GetUserRoutes());
    }


    public listen() {
        this.app.listen(this.port, () => {
            console.log("Server listening on port:", this.port);
            console.log("Version:", pkg.version);
        });
    }

    private cors() {
        const corsConfig = {
            origin: '*',
            optionsSuccessStatus: 200
        };
        this.app.use(cors(corsConfig));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    private async database(): Promise<void> {
        try {
            connect(process.env.MONGOOSE_DB, {
                user: process.env.MONGO_DATABASE_USER,
                pass: process.env.MONGO_DATABASE_PASSWORD,
                dbName: process.env.MONGO_DATABASE_DB,
                autoCreate: true
            })
                .then(db => console.log("Database Connected."))
                .catch(e => console.log("Error: ", e));
        } catch (e) {
            console.error("Error initializing database", e)
        }
    }
}




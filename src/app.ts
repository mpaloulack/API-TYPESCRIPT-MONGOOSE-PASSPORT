import express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/AppRoutes";
import Cors from "cors";
import morgan from "morgan";
import * as path from "path";
import passport from "passport";
import helmet from "helmet";
import rfs from "rotating-file-stream";
import { PassportConfig } from "./middleware/passport";
import compression from "compression";

class App {

    public app: express.Application;
    public routePrv: Routes;

    constructor() {
        this.app = express();
        this.routePrv = new Routes();
        this.config();
        this.routePrv.routes(this.app);
    }

    private async config(): Promise<void> {
        // upport for initialize passport and JWT
        new PassportConfig().init(passport);

        this.app.use(passport.initialize());

        // support application/json type post data
        this.app.use(bodyParser.json());

        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Support for access external website
        this.app.use(Cors());

        // support for security app
        this.app.use(helmet());

        // support for comporession
        this.app.use(compression());

        // Support for login
        const accessLogStream = rfs("access.log", {
            interval: "1d", // rotate daily
            path: path.join(__dirname, "log"),
        });

        this.app.use(morgan("combined", { stream: accessLogStream }));
    }

}

export default new App().app;

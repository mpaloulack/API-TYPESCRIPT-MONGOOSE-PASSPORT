import * as express from "express";
import { UserController } from "../../controllers/UserController";
import passport = require("passport");

class RoutesOauth {
    public router: express.Router = express.Router();
    public userController: UserController = new UserController();

    constructor() {
        this.config();
    }
    private config(): void {
        this.router.get("/google",
            passport.authenticate("google", {
                scope:
                    ["https://www.googleapis.com/auth/userinfo.email"]
            },
            ));

        this.router.get("/google/callback",
            passport.authenticate("google", {
                session: false,
            }), (req: express.Request, res: express.Response) => {
                this.userController.oAuth(req, res);
            });

        this.router.get("/facebook", passport.authenticate("facebook", {
            scope:
                ["email", "public_profile"]
        }));

        this.router.get("/facebook/callback",
            passport.authenticate("facebook", {
                session: false,
            }), (req: express.Request, res: express.Response) => {
                this.userController.oAuth(req, res);
            });
    }
}

export const routesOauth = new RoutesOauth().router;

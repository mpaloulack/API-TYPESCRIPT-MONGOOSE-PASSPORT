import * as express from "express";
import { UserController } from "../controllers/UserController";
import { PassportConfig } from "../../middleware/passport";

class RoutesUser {
    public router: express.Router = express.Router();
    public userController: UserController = new UserController();
    public passportConfig: PassportConfig = new PassportConfig();

    constructor() {
        this.config();
    }
    private config(): void {

        // Get user informations
        this.router.get("/:username", this.passportConfig.authorizedValidate,
        (req: express.Request, res: express.Response) => {
            this.userController.getProfile(req, res);
        });

        // Update user
        this.router.put("/", this.passportConfig.authorizedValidate, (req: express.Request, res: express.Response) => {
            this.userController.updateProfile(req, res, false);
        });

        // Validate user
        this.router.get("/validate/:token", (req: express.Request, res: express.Response) => {
            this.userController.validateUser(req, res);
        });

        // Disable user
        this.router.delete("/:id_user", (req: express.Request, res: express.Response) => {
            res.status(200).send({
                message: "DELETE request DISABLE User!!",
            });
        });

    }
}

export const routesUser = new RoutesUser().router;

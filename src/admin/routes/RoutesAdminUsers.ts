import * as express from "express";
import { PassportConfig } from "../../middleware/passport";
import { UserAdminController } from "../controllers/UserAdminController";
import { UserController } from "../../userGlobal/controllers/UserController";

class RoutesAdminUsers {
    public router: express.Router = express.Router();
    public passportConfig: PassportConfig = new PassportConfig();
    public userAdminController: UserAdminController = new UserAdminController();
    public userController: UserController = new UserController();

    constructor() {
        this.config();
    }
    private config(): void {

        // Get All users
        this.router.get("/", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.getAllUsers(req, res);
        });

        // Get All users
        this.router.put("/:id_user", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userController.updateProfile(req, res, true);
        });

        // Disable user account
        this.router.put("/disabled/:userId", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.disabledUser(req, res);
        });

        // Disable user account
        this.router.put("/disabled/:userId", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.disabledUser(req, res);
        });

        // Add admin role user account
        this.router.put("/putAdmin/:userId", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.addAdminUser(req, res);
        });

        // Add admin role user account
        this.router.put("/putModerator/:userId", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.addModeratorUser(req, res);
        });

        // Add admin role user account
        this.router.put("/putSuperAdmin/:userId", this.passportConfig.authorizedAdminValidate,
        (req: express.Request, res: express.Response) => {
            this.userAdminController.addSuperAdminUser(req, res);
        });
    }
}

export const routesAdminUsers = new RoutesAdminUsers().router;

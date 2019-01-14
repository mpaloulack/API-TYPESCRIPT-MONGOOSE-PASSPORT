import * as express from "express";
import { UserController } from "../../controllers/UserController";

class RoutesSignin {
    public router: express.Router = express.Router();
    public userController: UserController = new UserController();

    constructor() {
        this.config();
    }
    private config(): void {
        this.router.post("/", (req: express.Request, res: express.Response) => {
            this.userController.login(req, res);
        });
    }
}

export const routesSignin = new RoutesSignin().router;

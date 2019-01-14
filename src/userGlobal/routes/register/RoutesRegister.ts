import * as express from "express";
import { UserController } from "../../controllers/UserController";

class RoutesRegister {
    public router: express.Router = express.Router();
    public userController: UserController = new UserController();

    constructor() {
        this.config();
    }
    private config(): void {
        this.router.post("/", (req: express.Request, res: express.Response) =>
           this.userController.addNewUser(req.body, res),
        );
    }
}

export const routesRegister = new RoutesRegister().router;

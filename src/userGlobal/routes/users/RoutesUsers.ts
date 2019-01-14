import * as express from "express";

class RoutesUsers {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }
    private config(): void {
        this.router.get("/", (req: express.Request, res: express.Response) => {
            res.status(200).send({
                message: "GET request All USERS!!",
            });
        });
    }
}

export const routesUsers = new RoutesUsers().router;

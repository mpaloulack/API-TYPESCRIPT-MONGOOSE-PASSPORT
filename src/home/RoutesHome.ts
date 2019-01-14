import * as express from "express";

class RoutesHome {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }
    private config(): void {
        this.router.get("/", (req: express.Request, res: express.Response) => {
            res.status(200).send({
                message: "GET request Home!!",
            });
        });
    }
}

export const routesHome = new RoutesHome().router;

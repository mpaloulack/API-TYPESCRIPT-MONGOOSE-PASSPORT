import { Response } from "express";

export class ResponseAPI {
    public responseMsg(status: number, msg: any, res: Response) {
        let result = {};

        if (status >= 400) {
            result = {
                status,
                error: msg,
            };
        } else {
            result = {
                status,
                msg,
            };
        }

        res.status(status).send(result);
    }
}

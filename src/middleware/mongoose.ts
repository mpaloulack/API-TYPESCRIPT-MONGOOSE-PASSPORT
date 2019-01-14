import { connect } from "mongoose";
import dotenv = require("dotenv");
dotenv.config();

export class InitDB {
    public mongoUrl: string;
    public mongoDataBaseName: string;

    constructor() {
        this.mongoUrl = process.env.DB_HOST || "localhost";
        this.mongoDataBaseName = process.env.DB_NAME || "database";
    }

    public async mongoSetup(server: any): Promise<void> {
        await connect(`mongodb://${this.mongoUrl}/${this.mongoDataBaseName}`, { useNewUrlParser: true })
            .then(() => {
                // tslint:disable-next-line:no-console
                console.log("DB connect success");
            })
            .catch((err) => {
                // tslint:disable-next-line:no-console
                console.error(err);
                server.close();
            });
    }
}

import { connect } from "mongoose";
import dotenv = require("dotenv");
dotenv.config();
import { InitDataDB } from "../utils/Init/InitDataDB";

export class InitDB {
    public mongoUrl: string;
    public mongoDataBaseName: string;

    constructor() {
        this.mongoUrl = process.env.DB_HOST || "localhost";
        this.mongoDataBaseName = process.env.DB_NAME || "database";
    }

    public async mongoSetup(server: any): Promise<void> {
        await connect(`mongodb://${this.mongoUrl}/${this.mongoDataBaseName}`, { useNewUrlParser: true })
            .then(async () => {
                // tslint:disable-next-line:no-console
                console.log("DB connect success");
                const argv = require("minimist")(process.argv.slice(2));
                if (argv && argv.initDB) {
                    const initDataDB: InitDataDB = new InitDataDB();
                    await initDataDB.initDb();
                    // tslint:disable-next-line:no-console
                    console.log("done initDataDB");

                }
            })
            .catch((err) => {
                // tslint:disable-next-line:no-console
                console.error(err);
                server.close();
            });
    }
}

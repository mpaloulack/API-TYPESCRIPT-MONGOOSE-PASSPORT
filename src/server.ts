import app from "./app";
import { InitDB } from "./middleware/mongoose";

import dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.APP_PORT || 3000;
const server = app.listen(PORT, async () => {
    const initDB = new InitDB();
    // tslint:disable-next-line:no-console
    console.log("Express server listening on port " + PORT);
    // Init DB
    await initDB.mongoSetup(server);
});

import dotenv = require("dotenv");
dotenv.config();
import users from "./users.json";
import { User } from "../../userGlobal/schemas/UserSchema";

export class InitDataDB {
    /**
     * Method for execute many method for inite database
     */
    public async initDb(): Promise<void> {
        await this.initUserData();
        // tslint:disable-next-line:no-console
        console.log("done initUserData");
    }

    /**
     * Method for init list of user
     */
    private async initUserData(): Promise<void> {
        users.forEach(async (user) => {
            await User.findOne({username: user.username}, async (err, res) => {
                if (err) {
                    // tslint:disable-next-line:no-console
                    console.log("err findOne", err);
                } else if (!res) {
                    await User.create(user);
                }
            });
        });
    }
}

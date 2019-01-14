import { routesSignin } from "../userGlobal/routes/signup/RoutesSignin";
import { routesOauth } from "../userGlobal/routes/signup/RoutesOauth";
import { routesHome } from "../home/RoutesHome";
import { routesRegister } from "..//userGlobal/routes/register/RoutesRegister";
import { routesUser } from "../userGlobal/routes/RoutesUser";
import { routesUsers } from "../userGlobal/routes/users/RoutesUsers";
import { routesAdminUsers } from "../admin/routes/RoutesAdminUsers";
import express = require("express");

export class Routes {
    public routes(app: express.Application): void {
        const v1 = "/v1";

        app.use(v1 + "/", routesHome);
        app.use(v1 + "/login", routesSignin);
        app.use(v1 + "/register", routesRegister);
        app.use(v1 + "/user", routesUser);
        app.use(v1 + "/users", routesUsers);
        app.use(v1 + "/auth", routesOauth);
        app.use(v1 + "/admin/users", routesAdminUsers);
    }
}

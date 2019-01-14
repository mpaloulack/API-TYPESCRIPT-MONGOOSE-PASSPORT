import express = require("express");
import { ResponseAPI } from "../utils/ResponseAPI";
import { DISABLED } from "../userGlobal/schemas/roles";
import { IUser } from "../userGlobal/schemas/UserSchema";

export class Utils {
    /**
     * method for search value exist in array
     * @param value
     * @param array
     */
    public static findIfExistInArray(value: string, array: any[]) {
        return array.indexOf(value) === -1 ? false : true;
    }

    /**
     *
     * @param request: express.Request
     * @param response: express.Response
     * @param next: any
     * @param passport: any
     * @param roleSeek: string
     */
    public static authorizedMethodGenerique(
        request: express.Request,
        response: express.Response,
        next: any,
        passport: any,
        roleSeek: string) {
        const responseAPI = new ResponseAPI();
        const ctrl = this;
        // tslint:disable-next-line:only-arrow-functions
        passport.authenticate("jwt", { session: false }, function(error: Error, user: IUser) {
            if (error || !user) {
                return responseAPI.responseMsg(401, "Unauthorized", response);
            }
            try {
                if (ctrl.findIfExistInArray(DISABLED, user.roles)) {
                    return responseAPI.responseMsg(401, "Account disabled", response);

                } else if (ctrl.findIfExistInArray(roleSeek, user.roles)) {
                    request.user = user;
                    next(null, user);
                } else {
                    return responseAPI.responseMsg(401, "Unauthorized", response);
                }
            } catch (error) {
                return responseAPI.responseMsg(401, "Unauthorized", response);
            }
        })(request, response, next);
    }

    /**
     * method for search multiple values exist in array
     * @param value
     * @param array
     */
    public static multiFilter(arr: string[], filters: any[]): any[] {
        return arr.filter((eachObj) => {
            return filters.every((eachKey) => {
                return eachObj !== eachKey;
            });
        });
    }

}

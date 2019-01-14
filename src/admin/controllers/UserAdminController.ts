import { ADMIN, DISABLED,  MODERATOR, SUPERADMIN } from "../../userGlobal/schemas/roles";
import { Request, Response } from "express";
import { ResponseAPI } from "../../utils/ResponseAPI";
import { User, IUser } from "../../userGlobal/schemas/UserSchema";
import { Utils } from "../../middleware/utils";

import dotenv = require("dotenv");
dotenv.config();

export class UserAdminController {
    public responsesMsg: ResponseAPI = new ResponseAPI();

    /**
     * Get all users
     *
     * @param req
     * @param res
     */
    public async getAllUsers(req: Request, res: Response): Promise<any> {
        User.find({}, (err, users) => {
            if (err) {
                this.responsesMsg.responseMsg(500, err.message, res);
            } else if ( users ) {
                this.responsesMsg.responseMsg(200, { usersNumber: users.length,  users}, res);
            } else {
                this.responsesMsg.responseMsg(500, "Users not found", res);
            }
        });
    }

    /**
     * Disable user
     * @param req: Request
     * @param res: Response
     */
    public async disabledUser(req: Request, res: Response): Promise<any> {
        this.changeRoleUser(req, res, DISABLED);
    }

    /**
     * Add Admin role
     * @param req: Request
     * @param res: Response
     */
    public async addAdminUser(req: Request, res: Response): Promise<any> {
        this.changeRoleUser(req, res, ADMIN);
    }

    /**
     * Add Super Admin role
     * @param req: Request
     * @param res: Response
     */
    public async addSuperAdminUser(req: Request, res: Response): Promise<any> {
        this.changeRoleUser(req, res, SUPERADMIN);
    }

    /**
     * Add Moderator role
     * @param req: Request
     * @param res: Response
     */
    public async addModeratorUser(req: Request, res: Response): Promise<any> {
        this.changeRoleUser(req, res, MODERATOR);
    }

    /**
     * Methode for change user role
     * @param req: Request
     * @param res: Response
     */
    private async changeRoleUser(req: Request, res: Response, role: string): Promise<any> {
        const userId: string = req.params.userId;
        const ctrl = this;
        const userAdmin: IUser = req.user;
        if (userId) {
            User.findOne({ _id: userId }, async (err, user) => {
                if (err) {
                    this.responsesMsg.responseMsg(500, err.message, res);
                } else if (user) {

                    if (ctrl.checkRoles(user, userAdmin)) {

                        if (Utils.findIfExistInArray(role, user.roles)) {
                            this.responsesMsg.responseMsg(409, "Role already set", res);
                        } else {
                            let each: string[];

                            switch (role) {
                                case SUPERADMIN:
                                    each = [MODERATOR, ADMIN, SUPERADMIN];
                                    break;
                                case ADMIN:
                                    each = [MODERATOR, ADMIN];
                                    break;
                                case MODERATOR:
                                    each = [MODERATOR];
                                    break;
                                case DISABLED:
                                    each = [DISABLED];
                                    break;
                                default:
                                    break;
                            }
                            each = Utils.multiFilter(each, user.roles);

                            user.update({
                                $push: {
                                    roles: {
                                        $each: each,
                                    },
                                },
                            },
                                { upsert: true },
                                (error) => {
                                    if (error) {
                                        return this.responsesMsg.responseMsg(500, error.message, res);
                                    }
                                    this.responsesMsg.responseMsg(201, "User updated", res);
                                });
                        }
                    } else {
                        this.responsesMsg.responseMsg(401, "Unauthorized", res);
                    }
                } else {
                    this.responsesMsg.responseMsg(404, "user not found", res);
                }
            });
        } else {
            this.responsesMsg.responseMsg(500, "UserId not found", res);
        }
    }

    /**
     * Method check role user for modificiton role user modified
     * SuperAdmin modified : Admin, Moderator, User, notValidated
     * Admin modified : Moderator, User, notValidated
     * Moderator modified : User, notValidated
     * @param user: IUser
     * @param userAdmin: IUser
     */
    private checkRoles(user: IUser, userAdmin: IUser): boolean {
        const userIsAdmin = Utils.findIfExistInArray(ADMIN, user.roles);
        const userIsModerator = Utils.findIfExistInArray(MODERATOR, user.roles);
        const userIsSuperAdmin = Utils.findIfExistInArray(SUPERADMIN, user.roles);
        const userWhoUpdateotherUserIsAdmin = Utils.findIfExistInArray(ADMIN, userAdmin.roles);
        const userWhoUpdateotherUserIsModerator = Utils.findIfExistInArray(MODERATOR, userAdmin.roles);
        const userWhoUpdateotherUserISuperAdmin = Utils.findIfExistInArray(SUPERADMIN, userAdmin.roles);

        if (userWhoUpdateotherUserISuperAdmin) {
            if (userIsSuperAdmin) { return false; }
            return true;
        } else if (userWhoUpdateotherUserIsAdmin) {
            if (userIsSuperAdmin || userIsAdmin) { return false; }
            return true;
        } else if (userWhoUpdateotherUserIsModerator) {
            if (userIsSuperAdmin || userIsAdmin || userIsModerator) { return false; }
            return true;
        }
    }

}

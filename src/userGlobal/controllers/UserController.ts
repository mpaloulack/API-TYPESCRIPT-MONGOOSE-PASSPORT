import { User, IUser } from "../schemas/UserSchema";
import { Request, Response } from "express";
import { ResponseAPI } from "../../utils/ResponseAPI";
import * as jwt from "jsonwebtoken";
import { NOTVALIDATED, USER, DISABLED } from "../schemas/roles";
import { Utils } from "../../middleware/utils";
import dotenv = require("dotenv");
import { IUserGoogle } from "../models/IUserGoogle";
import { IGetHeaderAuthInfoRequest } from "../../utils/IGetHeaderAuthInfoRequest";
import { IOAuth } from "../models/IOAuth";
import { IProfileOAuth } from "../models/IProfile";

dotenv.config();

export class UserController {
    public responsesMsg: ResponseAPI = new ResponseAPI();
    public JWT_SECRET: string = process.env.JWT_SECRET || "SecretByDefault";
    public JWT_EXPIRES: number = parseInt(process.env.JWT_EXPIRES, 10) || 604800;

    /**
     * method use for callback Aouth login
     * @param req: Request
     * @param res: Response
     */
    public async oAuth(req: Request, res: Response): Promise<void> {
        if (req.user) {
            this.responsesMsg.responseMsg(201, req.user, res);
        } else {
            this.responsesMsg.responseMsg(500, "user profile information not found", res);
        }
    }

    /**
     * Method for get provider in OAuth
     * @param provider: string
     * @param oAuthList: IOAuth[]
     */
    private findProvider(provider: string, oAuthList: IOAuth[]) {
        return oAuthList.filter((oAuth: IOAuth) => oAuth.provider === provider).length > 0;
    }

    /**
     *
     * @param request: IGetHeaderAuthInfoRequest
     * @param accessToken: any
     * @param profile: IProfileOAuth
     * @param next: any
     * @param provider: string
     */
    public async oAuthPassport(
            request: IGetHeaderAuthInfoRequest,
            accessToken: any,
            profile: IProfileOAuth,
            next: any,
            provider: string) {
        User.findOne({ email: profile.emails[0].value }, async (err, user) => {
            if (err) {
                next(err);
            }
            if (user) {
                // tslint:disable-next-line:no-shadowed-variable
                const jwt: any = await this.createJWT(user, request);

                if (!this.findProvider(provider, user.oAuth)) {
                    user.oAuth.push({
                        token: accessToken,
                        provider: profile.provider,
                        id: profile.id,
                    });

                    await user.update(user);
                }

                next(null, jwt);
            } else {
                const oAuth = [];
                oAuth.push({
                    token: accessToken,
                    provider: profile.provider,
                    id: profile.id,
                });

                const userGoogle: IUserGoogle = {
                    email: profile.emails[0].value,
                    firstname: profile.name.familyName,
                    lastName: profile.name.givenName,
                    oAuth,
                };
                request.userGoogle = userGoogle;
                return next(null, userGoogle);
            }

        });
    }

    /**
     * Method for create new User
     * @param newUser: IUser
     * @param res: Response
     */
    public async addNewUser(newUser: IUser, res: Response): Promise<void> {
        if (newUser) {
            const user = new User(newUser);
            await user.save((err: any) => {
                if (err) {
                    this.responsesMsg.responseMsg(500, err.message, res);
                } else {
                    this.responsesMsg.responseMsg(201, "User created", res);
                }
            });
        } else {
            this.responsesMsg.responseMsg(500, "user information not found", res);
        }
    }

    /**
     * Method for update user
     * @param req: Request
     * @param res: Response
     * @param isAdmin: boolean
     */
    public async updateProfile(req: Request, res: Response, isAdmin: boolean): Promise<void> {
        const userUpdatedInfos: IUser = req.body;

        if (userUpdatedInfos) {
            const userTemps = {
                firstName: userUpdatedInfos.firstName,
                lastName: userUpdatedInfos.lastName,
                email: userUpdatedInfos.email,
                company: userUpdatedInfos.company,
                phone: userUpdatedInfos.phone,
            };
            let query;
            if (!isAdmin) {
                query = { _id: req.user._id };
            } else {
                if (req.params.userId) {
                    query = { _id: req.params.userId };

                } else {
                    return this.responsesMsg.responseMsg(401, "Error with userId", res);
                }
            }
            const opts = { runValidators: true, context: "query" };

            const userOld = await User.findOne({ _id: query }, (err, user) => {
                if (err || !user) {
                    return this.responsesMsg.responseMsg(401, "Error with profile", res);
                }
                return user;
            });

            await userOld.update(userTemps, opts, (err, user) => {
                if (err || !user) {
                    return this.responsesMsg.responseMsg(401, "Error with update", res);
                }

                return this.responsesMsg.responseMsg(201, "User updated", res);
            });
        } else {
            this.responsesMsg.responseMsg(401, "Userupdated not found", res);
        }

    }

    /**
     * Method for validate user profile
     * @param req: Request
     * @param res: Response
     */
    public async validateUser(req: Request, res: Response): Promise<void> {
        const token = req.params.token;

        if (token) {
            User.findOne({ emailValidate: { $elemMatch: { token } } }, async (err, user) => {
                if (err) {
                    this.responsesMsg.responseMsg(500, err.message, res);
                } else if (user) {

                    user.update({ $pull: { roles: NOTVALIDATED } }, (error) => {
                        if (error) {
                            return this.responsesMsg.responseMsg(500, error.message, res);
                        }
                        user.update({ $push: { roles: USER } }, (errorUpdate) => {
                            if (errorUpdate) {
                                return this.responsesMsg.responseMsg(500, error.message, res);
                            }
                            this.responsesMsg.responseMsg(201, "User updated", res);
                        });
                    });
                } else {
                    this.responsesMsg.responseMsg(404, "user not found", res);
                }
            });
        } else {
            this.responsesMsg.responseMsg(500, "error not validate user", res);
        }
    }

    /**
     * Method for disable user
     * @param req: Request
     * @param res: Response
     */
    public async disabledUser(req: Request, res: Response): Promise<any> {
        const userId = req.params.userId;

        if (userId) {
            User.findOne({ _id: userId }, async (err, user) => {
                if (err) {
                    this.responsesMsg.responseMsg(500, err.message, res);
                } else if (user) {

                    user.update({ $push: { roles: { roleName: DISABLED } } }, (error) => {
                        if (error) {
                            return this.responsesMsg.responseMsg(500, error.message, res);
                        }
                        this.responsesMsg.responseMsg(201, "User disabled", res);
                    });
                } else {
                    this.responsesMsg.responseMsg(404, "user not found", res);
                }
            });
        } else {
            this.responsesMsg.responseMsg(500, "UserId not found", res);
        }
    }

    /**
     * Method for get profil User
     * @param req: Request
     * @param res: Response
     */
    public getProfile(req: Request, res: Response): void {
        if (req.params.username) {
            const selectMyOwnProfileValue = req.params.username === req.user.username ? "" : "-loginHistory";
            User
                .findByUsername(req.params.username,
                    selectMyOwnProfileValue,
                    (
                        err: { message: string },
                        user: IUser,
                    ) => {
                        if (err) {
                            this.responsesMsg.responseMsg(500, err.message, res);
                        } else if (user) {
                            this.responsesMsg.responseMsg(201, user, res);
                        } else {
                            this.responsesMsg.responseMsg(404, "user not found", res);
                        }
                    });
        } else {
            this.responsesMsg.responseMsg(400, "user information not found", res);
        }
    }

    /**
     * Method for login user
     * @param req: Request
     * @param res: Response
     */
    public login(req: Request, res: Response): void {
        const { username, password } = req.body;
        if (username && password) {
            User
                .findOne({ username }, (err, user) => {
                    if (err) {
                        this.responsesMsg.responseMsg(500, err.message, res);
                    } else {
                        if (user) {
                            if (Utils.findIfExistInArray(DISABLED, user.roles)) {
                                return this.responsesMsg.responseMsg(401, "Compte non validee", res);
                            } else {
                                user.comparePasswords(password, user.password,
                                    async (error: Error, isMatch: boolean) => {
                                    if (isMatch) {
                                        const results = await this.createJWT(user, req);

                                        this.responsesMsg.responseMsg(200, results, res);
                                    } else {
                                        this.responsesMsg.responseMsg(401, "Wrong password/username", res);
                                    }
                                });
                            }
                        } else {
                            this.responsesMsg.responseMsg(401, "Wrong password/username", res);
                        }
                    }
                });
        } else {
            this.responsesMsg.responseMsg(401, "Password/username not found", res);
        }
    }

    /**
     * Methode for create json web token
     * @param req: Request
     * @param res: Response
     */
    public async createJWT(user: IUser, req: Request) {
        const userJWT = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const token = jwt.sign(userJWT,
            this.JWT_SECRET, {
                expiresIn: this.JWT_EXPIRES,
            });

        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const now = new Date();

        const loginHistory = {
            token,
            device: "teest",
            ip,
            createdAt: now,
        };

        user.loginHistory.push(loginHistory);

        await user.update(user);

        return {
            user: userJWT,
            token,
        };
    }
}

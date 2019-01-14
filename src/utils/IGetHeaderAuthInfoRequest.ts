import { Request } from "express";
import { IUserGoogle } from "../userGlobal/models/IUserGoogle";

export interface IGetHeaderAuthInfoRequest extends Request {
    userGoogle: IUserGoogle;
}

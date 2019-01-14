import { IOAuth } from "./IOAuth";

export interface IUserGoogle {
    email: string;
    firstname: string;
    lastName: string;
    oAuth: IOAuth[];
}

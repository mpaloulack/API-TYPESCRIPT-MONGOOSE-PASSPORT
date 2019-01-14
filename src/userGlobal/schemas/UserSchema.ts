import { Schema, Model, model } from "mongoose";
import { IUserDocument } from "../models/IUserDocument";
import * as bcrypt from "bcryptjs";
import { NOTVALIDATED } from "./roles";
import uuidv4 from "uuid/v4";

import { Email } from "../../middleware/email";
import { registerEmail } from "../../middleware/ContentEmail";

import dotenv = require("dotenv");
dotenv.config();

import uniqueValidator = require("mongoose-unique-validator");

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR, 10) || 10;

export interface IUser extends IUserDocument {
    comparePasswords(password: string, passwordFind: string, cb: any): boolean;
}

export interface IUserModel extends Model<IUser> {
    findByUsername(username: string, selectMyOwnProfileValue: string, cb: any): IUserDocument;
}

function emailValidator(email: string) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

const schema = new Schema({
    username: {
        type: String,
        required: "Enter a username",
        max: 100,
        unique: true,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: "Enter a first name",
        max: 100,
    },
    lastName: {
        type: String,
        required: "Enter a last name",
        max: 100,
    },
    email: {
        type: String,
        validate: { validator: emailValidator, msg: `votre {PATH} : {VALUE} n'est pas valide` },
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    phone: {
        type: Number,
    },
    emailValidate: [
        {
            createdAt: {
                type: Date,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
        },
    ],
    roles: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        required: false,
    },
    modifiedAt: {
        type: Date,
        required: false,
    },
    oAuth: [{
        token: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    }],
    loginHistory: [{
        token: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        device: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
    }],

});

schema.pre("save", function(this: any, next) {
    const user = this;
    let userCreat = false;
    if (user) {
        const now = new Date();

        if (!user.createdAt) {
            userCreat = true;
            user.createdAt = now;
            user.modifiedAt = now;
            user.roles.push(NOTVALIDATED);
        } else {
            user.modifiedAt = now;
        }

        if (!user.isModified("password")) { return next(); } else {
            // generate a salt
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) { return next(err); }

                // hash the password using our new salt
                bcrypt.hash(user.password, salt, async (error, hash) => {
                    if (error) { return next(err); }
                    // override the cleartext password with the hashed one

                    if (userCreat) {
                        const emailValidate = {
                            createdAt: now,
                            token: uuidv4(),
                        };

                        registerEmail.html = registerEmail.html.replace("{{username}}", user.username);
                        registerEmail.html = registerEmail.html.replace("{{sitename}}", process.env.SITENAME);
                        registerEmail.html = registerEmail.html.replace("{{token}}", emailValidate.token);

                        const emailController = new Email();
                        await emailController.emailSend(user.email, registerEmail.subject, registerEmail.html);
                        user.emailValidate.push(emailValidate);
                    }
                    user.password = hash;
                    return next();
                });
            });
        }
    } else {
        next();
    }
});

schema.plugin(uniqueValidator);

schema.methods.comparePasswords = async (userPassword: string, passwordFind: string, cb: any) => {
    await bcrypt.compare(userPassword, passwordFind, (err, isMatch) => {
        if (isMatch) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    });
};

schema.statics.findByUsername = async  (
    username: string,
    selectMyOwnProfileValue: string,
    cb: any): Promise<IUserDocument> => {
    return this
        .model("User").findOne({ username }, cb)
        .select("-_id -password -__v " + selectMyOwnProfileValue);
};

// Omit the password when returning a user
schema.set("toJSON", {
    transform:  (doc: any, ret: { password: any; }) => {
        delete ret.password;
        return ret;
    },
});

export let User = model<IUser, IUserModel>("User", schema, "Users", true);

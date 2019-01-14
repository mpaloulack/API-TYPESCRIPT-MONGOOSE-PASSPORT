
import { User } from "../userGlobal/schemas/UserSchema";
import passport = require("passport");
import express = require("express");
import { UserController } from "../userGlobal/controllers/UserController";
import { ADMIN, USER } from "../userGlobal/schemas/roles";
import { Utils } from "./utils";
import dotenv = require("dotenv");
dotenv.config();

import PassportJWT = require("passport-jwt");
import PassportGoogle = require("passport-google-oauth2");
import PassportFacebook = require("passport-facebook");
import { IGetHeaderAuthInfoRequest } from "../utils/IGetHeaderAuthInfoRequest";

export class PassportConfig {
  public userController: UserController = new UserController();
  public utils: Utils = new Utils();
  private jwtSecret: string = process.env.JWT_SECRET || "TestJWTSecret";
  private clientIDGoogleAuth: string = process.env.CLIENT_ID_GOOGLE;
  private clientSecretGoogleAuth: string = process.env.CLIENT_SECRET_GOOGLE;
  private callbackURLGoogleAuth: string = process.env.CLIENT_CB_URL_GOOGLE;
  private clientIDFacebookAuth: string = process.env.CLIENT_ID_FACEBOOK;
  private clientSecretFacebookAuth: string = process.env.CLIENT_SECRET_FACEBOOK;
  private callbackURLFacebookAuth: string = process.env.CLIENT_CB_URL_FACEBOOK;
  private providergoogle: string = "google";
  private JWTstrategy = PassportJWT.Strategy;
  private FacebookStrategy = PassportFacebook.Strategy;
  private GoogleStrategy = PassportGoogle.Strategy;
  private ExtractJwt = PassportJWT.ExtractJwt;
  constructor() {
    if (!this.clientIDGoogleAuth || !this.clientSecretGoogleAuth || !this.callbackURLGoogleAuth ||
      !this.clientIDFacebookAuth || !this.clientSecretFacebookAuth || !this.callbackURLFacebookAuth) {
      throw new Error("Config oAuth not found");
      }
  }

  // tslint:disable-next-line:no-shadowed-variable
  public init(passport: any) {
    const opts = {
      jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.jwtSecret,
    };
    passport.serializeUser((user: any, cb: any) => {
      cb(null, user);
    });

    passport.deserializeUser(async (user: any, cb: any) => {
      cb(null, user);
    });

    // tslint:disable-next-line:only-arrow-functions
    passport.use("jwt", new this.JWTstrategy(opts, function(jwtPayload, done) {
      User.findOne({ _id: jwtPayload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    }));

    passport.use(new this.GoogleStrategy({
      clientID: this.clientIDGoogleAuth,
      clientSecret: this.clientSecretGoogleAuth,
      callbackURL: this.callbackURLGoogleAuth,
      passReqToCallback: true,
    },
      async (request: IGetHeaderAuthInfoRequest, accessToken, refreshToken, profile, next) => {
        this.userController.oAuthPassport(request, accessToken, profile, next, this.providergoogle);
      }));

    // TODO : A completer une fois le site en route
/*     passport.use(new this.FacebookStrategy({
      clientID: this.clientIDFacebookAuth,
      clientSecret: this.clientSecretFacebookAuth,
      callbackURL: this.callbackURLFacebookAuth,
      profileFields: ["id", "displayName", "emails"]
    },
    async (accessToken, refreshToken, profile, next) => {
        this.userController.oAuthPassport(request, accessToken, profile, next, this.providergoogle);
      },
    )); */
  }
  public authorizedValidate(request: express.Request, response: express.Response, next: any) {
    Utils.authorizedMethodGenerique(request, response, next, passport, USER);
  }

  public authorizedAdminValidate(request: express.Request, response: express.Response, next: any): void {
    Utils.authorizedMethodGenerique(request, response, next, passport, ADMIN);
  }
}

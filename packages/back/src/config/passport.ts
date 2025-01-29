import type { Express } from "express";
import passport from "passport";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const configure = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        return prisma.userCredential
          .findUnique({ where: { email } })
          .then(async (user) => {
            if (!user)
              return done(undefined, false, {
                message: "Invalid email or password",
              });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
              return done(undefined, false, {
                message: "Invalid email or password",
              });
            return done(undefined, user);
          })
          .catch((err) => done(err));
      },
    ),
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (jwtPayload, cb) => {
        try {
          const user = await prisma.userCredential.findUnique({
            where: { id: jwtPayload.id },
          });
          if (!user) throw new Error("Not found the user");
          return cb(null, user);
        } catch (err) {
          return cb(err);
        }
      },
    ),
  );
};

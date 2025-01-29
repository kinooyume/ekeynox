import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import passport, { AuthenticateCallback } from "passport";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const registerUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "email/password are required",
    });
  }

  // NOTE: we probably don't need to wrap register ? try/catch, faut si faire
  const register = async () => {
    const emailUsed = await prisma.userCredential.findUnique({
      where: { email },
    });
    // on veut créer un user et userSettings

    if (emailUsed) {
      throw new Error("User already exists with email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.userCredential.create({
      data: {
        email,
        password: hashedPassword,
        settings: {
          create: {},
        },
      },
    });

    return user;
  };

  return register()
    .then((user) => {
      return res.json(user);
    })
    .catch((err) => {
      return res.status(400).send({
        status: false,
        message: err.message,
      });
    });
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    Promise.reject(new Error("email, password are required."));
  }
  const loginCallback: AuthenticateCallback = (err, user, info) => {
    if (err) Promise.reject(err);
    // if (info?.message) Promise.reject(new Error(info.message));
    Promise.resolve(user);
  };

  const login = async () => {
    return passport.authenticate("login", { session: false }, loginCallback)(
      req,
      res,
      next,
    );
  };

  return login()
    .then((user) => {
      const { id } = user;
      const token = jwt.sign(
        {
          id,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        },
      );
      return res.status(200).json({ status: true, token });
    })
    .catch((err) => {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    });
};

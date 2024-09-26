import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

type User = typeof Prisma.validator<Prisma.UserSelect>;

export const getUser = async (req: Request, res: Response) => {
  return prisma.user
    .findMany()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((e) => {
      res.status(500).json({ error: e });
    })
    .finally(() => prisma.$disconnect());
};

type UserRequest = {
  name?: string;
  email: string;
};

export const createUser = async (req: Request<UserRequest>, res: Response) => {
  return prisma.user
    .create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((e) => {
      res.status(500).json({ error: e });
    })
    .finally(() => prisma.$disconnect());
};

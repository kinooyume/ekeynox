import { Prisma, PrismaClient } from "@prisma/client";
import type { Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

export const getUser: RequestHandler = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  return prisma.userSettings
    .findUnique({ where: { id: userId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((e) => {
      // il faudrait logger du coup
      res.status(500).json({ error: e });
    })
    .finally(() => prisma.$disconnect());
};

type UserRequest = {
  name?: string;
  email: string;
};

// export const createUser : RequestHandler = async (req, res: Response) => {
//   return prisma.user
//     .create({
//       data: {
//         name: req.body.name,
//         email: req.body.email,
//       },
//     })
//     .then((user) => {
//       res.status(200).json(user);
//     })
//     .catch((e) => {
//       console.log(e);
//       // e.name === PrismaClientValidationError
//       res.status(500).json({ error: e });
//     })
//     .finally(() => prisma.$disconnect());
// };

// il faudrait se baser l'id
// NOTE: peut etre des routes pour chaque params, pour le mode quick stuff
export const updateUser: RequestHandler = async (req, res) => {
  const { name, theme, locale, keyboardLayout, showKb } = req.body;
  const userId = parseInt(req.params.id, 10);
  return prisma.userSettings
    .update({
      where: {
        id: userId,
      },
      data: {
        name,
        theme,
        locale,
        keyboardLayout,
        showKb,
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

type UserDeleteRequest = {
  id: string;
};

export const deleteUser = async (
  req: Request<UserDeleteRequest>,
  res: Response,
) => {
  return prisma.userSettings
    .delete({
      where: {
        id: req.body.id,
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

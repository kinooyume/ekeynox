import { Router } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/usersController";
// import {
//   createUser,
//   deleteUser,
//   getUser,
//   updateUser,
// } from "../controllers/userController";

const usersRouter = Router();

usersRouter.route("/").get(() => {});

usersRouter
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default usersRouter;

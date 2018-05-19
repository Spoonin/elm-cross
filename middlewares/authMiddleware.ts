import { RequestHandler } from "express";
import users from "../models/users";

const autMiddleware: RequestHandler = (req, res, next) => {
  if (req.cookies.userId) {
    const user = users.get(req.cookies.userId);
    if (user) {
      req.me = user;
      next();
    } else {
      res.status(404).send("user not found");
    }
  } else {
    res.status(401).send("not authorized");
  }
};
export default autMiddleware;

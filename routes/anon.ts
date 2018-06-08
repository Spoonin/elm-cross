import { Router } from "express";
import User from "../models/user";
import users from "../models/users";

const router = Router();

router.post("users/", (req, res) => {
  if (users.has(req.body.id)) {
    res.status(406).send("User exists");
  } else {
    users.set(req.body.id, new User(req.body.id));
    res.send({ success: true, userId: req.body.id });
  }
});

export default router;

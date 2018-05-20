import { Router } from "express";
import User from "../models/user";
import users from "../models/users";
import games from "../models/games";
import guid from "../utils/guid";
import Game from "../models/game";
import getResourceMw from "../middlewares/resourceMiddleware";

const router = Router();

router.get("/", (req, res) => {
  const result =
    req.query.filter === "free"
      ? [...users.values()].filter(u => !u.isPlaying && u !== req.me)
      : [...users.values()].filter(u => u !== req.me);

  res.send(result);
});

router.post("/:id/invitation", getResourceMw(users), (req, res) => {
  const user = <User>req.resource;
  user.invitedBy.add(req.me.id);
  req.me.invitations.add(req.params.id);
  res.send({ success: true });
});

router.delete("/:id/invitation", getResourceMw(users), (req, res) => {
  const user = <User>req.resource;
  user.invitedBy.delete(req.me.id);
  req.me.invitations.delete(req.params.id);
  res.send({ success: true });
});

router.post("/:id/invitationAccept", getResourceMw(users), (req, res) => {
  const user = <User>req.resource;
  if (!user.invitations.has(req.me.id) || !req.me.invitedBy.has(user.id)) {
    throw new Error(`Invalid invitation state ${req.params.id}`);
  }
  user.invitations.delete(req.me.id);
  req.me.invitedBy.delete(req.params.id);
  const gameId = guid();
  games.set(gameId, new Game(gameId, req.me.id, user.id));

  res.send({ gameId });
});

export default router;

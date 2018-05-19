import { Router } from "express";
import User from "../models/user";
import users from "../models/users";
import games from "../models/games";
import guid from "../utils/guid";
import Game from "../models/game";

declare global {
  namespace Express {
    interface Request {
      me: User;
    }
  }
}

const router = Router();

router.get("/", (req, res) => {
  const result =
    req.query.filter === "free"
      ? [...users.values()].filter(u => !u.isPlaying && u !== req.me)
      : [...users.values()].filter(u => u !== req.me);

  res.send(result);
});

router.post("/invitaition/:id", (req, res) => {
  const user = users.get(req.params.id);
  if (user) {
    user.invitedBy.add(req.me.id);
    req.me.invitations.add(req.params.id);
    res.send({ success: true });
  } else {
    res.status(404).send("User not found");
  }
});

router.delete("/invitation/:id", (req, res) => {
  const user = users.get(req.params.id);
  if (user) {
    user.invitedBy.delete(req.me.id);
    req.me.invitations.delete(req.params.id);
    res.send({ success: true });
  } else {
    res.status(404).send("User not found");
  }
});

router.post("/invitationAccept/:id", (req, res) => {
  const user = users.get(req.params.id);
  if (user) {
    if (!user.invitations.has(req.me.id) || !req.me.invitedBy.has(user.id)) {
      throw new Error(`Invalid invitation state ${req.params.id}`);
    }
    user.invitations.delete(req.me.id);
    req.me.invitedBy.delete(req.params.id);
    const gameId = guid();
    games.set(gameId, new Game(gameId, req.me.id, user.id));

    res.send({ gameId });
  } else {
    res.status(404).send("User not found");
  }
});

export default router;

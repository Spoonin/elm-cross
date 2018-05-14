import { Router } from "express";
import User from "../models/user";
import users from "../users";
import games from "../games";
import guid from "../utils/guid";
import Game from "../models/game";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const router = Router();

router.get("/", (req, res) => {
  const result =
    req.query.filter === "free"
      ? [...users.values()].filter(u => !u.isPlaying && u.id !== req.userId)
      : [...users.values()].filter(u => u.id !== req.userId);

  res.send(result);
});

router.post("/", (req, res) => {
  if (users.has(req.body.id)) {
    res.status(406).send("User exists");
  } else {
    users.set(req.body.id, new User(req.body.id));
    res.cookie("userId", req.body.id);
    res.send({ success: true });
  }
});

router.post("/invitaition/:id", (req, res) => {
  if (req.params.id) {
    const user = users.get(req.params.id);
    if (user) {
      user.invitedBy.add(req.userId);
      const me = users.get(req.userId);

      if (me) {
        me.invitations.add(req.params.id);
      } else {
        throw new Error(`Invalid user ${req.params.id}`);
      }

      res.send({ success: true });
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(404).send("User not found");
  }
});

router.delete("/invitation/:id", (req, res) => {
  if (req.params.id) {
    const user = users.get(req.params.id);
    if (user) {
      user.invitedBy.delete(req.userId);
      const me = users.get(req.userId);

      if (me) {
        me.invitations.delete(req.params.id);
      } else {
        throw new Error(`Invalid user ${req.params.id}`);
      }

      res.send({ success: true });
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(404).send("User not found");
  }
});

router.post("/invitationAccept/:id", (req, res) => {
  if (req.params.id) {
    const user = users.get(req.params.id);
    if (user) {
      const me = users.get(req.userId);
      if (me) {
        if (!user.invitations.has(me.id) || !me.invitedBy.has(user.id)) {
          throw new Error(`Invalid invitation state ${req.params.id}`);
        }
        user.invitations.delete(req.userId);
        me.invitedBy.delete(req.params.id);
      } else {
        throw new Error(`Invalid user ${req.params.id}`);
      }
      const gameId = guid();
      games.set(gameId, new Game(gameId, me.id, user.id));

      res.send({ gameId });
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(404).send("User not found");
  }
});

export default router;

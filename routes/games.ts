import { Router } from "express";
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

router.get("/:id", (req, res) => {
  const game = games.get(req.params.id);
  const me = users.get(req.userId);
  if (game) {
    if (me) {
      if (game.isPlayer(me.id)) {
        res.send(game);
      } else {
        res.status(401).send("Not authorized");
      }
    } else {
      throw new Error(`Invalid user ${req.params.id}`);
    }
  } else {
    res.status(404).send("no such game");
  }
});

export default router;

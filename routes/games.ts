import { Router } from "express";
import users from "../models/users";
import User from "../models/user";
import games from "../models/games";
import guid from "../utils/guid";
import Game from "../models/game";
import { HttpError } from "../utils/interfaces";

declare global {
  namespace Express {
    interface Request {
      me: User;
    }
  }
}

const router = Router();

router.get("/:id", (req, res) => {
  if (req.params.id) {
    const game = games.get(req.params.id);
    if (game) {
      if (game.isPlayer(req.me.id)) {
        res.send(game);
      } else {
        res.status(401).send("Not authorized");
      }
    } else {
      res.status(404).send("no such game");
    }
  } else {
    const predicate = req.params.filter.active
      ? (g: Game) => g.isPlayer(req.me.id) && !g.isFinished()
      : (g: Game) => g.isPlayer(req.me.id);
    res.send([...games.values()].filter(predicate));
  }
});

export default router;

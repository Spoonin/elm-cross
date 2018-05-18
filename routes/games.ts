import { Router } from "express";
import users from "../models/users";
import games from "../models/games";
import guid from "../utils/guid";
import Game from "../models/game";
import { HttpError } from "../utils/interfaces";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const router = Router();

router.get("/:id", (req, res) => {
  const me = users.get(req.userId);
  if (me) {
    if (req.params.id) {
      const game = games.get(req.params.id);
      if (game) {
        if (game.isPlayer(me.id)) {
          res.send(game);
        } else {
          res.status(401).send("Not authorized");
        }
      } else {
        res.status(404).send("no such game");
      }
    } else {
      const predicate = req.params.filter.active
        ? (g: Game) => g.isPlayer(me.id) && !g.isFinished()
        : (g: Game) => g.isPlayer(me.id);
      res.send([...games.values()].filter(predicate));
    }
  } else {
    res.status(401).send("User not found");
  }
});

router.post("/:id/move", (req, res) => {
  
});

export default router;

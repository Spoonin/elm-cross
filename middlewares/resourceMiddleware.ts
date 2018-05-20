import { RequestHandler } from "express";

export default function getNotfoundMiddleware<T>(collection: Map<string, T>): RequestHandler {
  return (req, res, next) => {
    if (!req.params.id) {
      res.status(400).send("no required param");
    } else {
      const resource = collection.get(req.params.id);
      if (!resource) {
        res.status(404).send("resource not found");
      } else {
        req.resource = resource;
        next();
      }
    }
  };
}

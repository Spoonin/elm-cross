import "express";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      me: User;
      resource: Object;
    }
  }
}

export class HttpError extends Error {
  status: number = 500;
}

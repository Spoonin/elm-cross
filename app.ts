import * as express from 'express'; //eslint-disable-line
import { Request, Response, NextFunction } from "express"; //eslint-disable-line
import { HttpError } from "./utils/interfaces";
import authMiddleware from "./middlewares/auth";
import anonymousRouter from "./routes/anon";
import usersRouter from "./routes/users";
import gamesRouter from "./routes/games";

const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
export default app;
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", anonymousRouter);
app.use("/users", authMiddleware, usersRouter);
app.use("/games", authMiddleware, gamesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new HttpError("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-line
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import http from "http";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import { Server as SocketIo } from "socket.io";
import express, { NextFunction, Request, Response } from "express";

import "express-async-errors";

import BaseRouter from "./routes/api";
import logger from "jet-logger";
import { CustomError } from "@shared/errors";
import { cookieProps } from "./common/cookie";

import { auth } from "express-openid-connect";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Error handling
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

// Add AuthO
// secret personally generated with openssl
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "95a49970a0b5acf6f60fa7f7487d95e5b76e1e1f70eec4f674136319ca79af85",
  baseURL: "http://localhost:3000",
  clientID: "F8EUSeKUVlu8JYfLQ319aiJA7rT9aRvl",
  issuerBaseURL: "https://dev-fs4kgega.us.auth0.com",
};

// Auth0 router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

/************************************************************************************
 *                                   Setup Socket.io
 * Tutorial used for this: https://www.valentinog.com/blog/socket-react/
 ***********************************************************************************/

const server = http.createServer(app);
const io = new SocketIo(server);

io.sockets.on("connect", () => {
  return app.set("socketio", io);
});

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;

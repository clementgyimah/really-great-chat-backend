import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import http from "http";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import { Server as SocketIo } from "socket.io";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import "express-async-errors";

import BaseRouter from "./routes/api";
import logger from "jet-logger";
import { CustomError } from "@shared/errors";
import { cookieProps } from "./common/cookie";
// import {expressjwt as jwt} from 'express-jwt';
// import jwks from 'jwks-rsa'

import { initializeApp } from "firebase/app";
import authRouter from "@routes/auth-router";
import { IUser } from "./customTypes";
const { OK } = StatusCodes;

// import { auth } from "express-openid-connect";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));
app.use(cors());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

const firebaseConfig = {
  apiKey: "AIzaSyCLFqZl2Wz_teKMR8v7SrmgIayhZ7iue8g",
  authDomain: "really-great-chat.firebaseapp.com",
  projectId: "really-great-chat",
  storageBucket: "really-great-chat.appspot.com",
  messagingSenderId: "640428196643",
  appId: "1:640428196643:web:8157d8806309efe6e1c296",
  measurementId: "G-L62GS3L6NR",
  databaseURL:
    // eslint-disable-next-line max-len
    "https://really-great-chat-default-rtdb.firebaseio.com",
};

// Initialize Firebase
initializeApp(firebaseConfig);

app.get("/", (_: Request, res: Response) => {
  res.status(OK).send("Welcome to the Great Chat API");
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use("/auth", authRouter);

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
const io = new SocketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://really-great-chat-frontend.herokuapp.com"],
  },
});

io.on("connection", () => {
  return app.set("socketio", io);
});

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;

import { Router, Request, Response } from "express";
import StatusCodes from "http-status-codes";
const router = Router();
const { OK } = StatusCodes;
import {
  ParamMissingError,
  FirebaseNoDataError,
} from "@shared/errors";
import { getDatabase, ref, set, get, child } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { IErrorProp } from "@customTypes/interface";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/login", async (req: Request, res: Response) => {
  const auth = getAuth();
  const databaseRef = ref(getDatabase());
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new ParamMissingError();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userData) => {
        if (!!userData) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          await get(child(databaseRef, `users/${userData.user.uid}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                return res.status(OK).send(snapshot.val());
              } else {
                throw new FirebaseNoDataError();
              }
            })
            .catch((err: IErrorProp) => {
              res.status(err.code).send(err.message);
            });
        }
        throw new FirebaseNoDataError();
      })
      .catch((err: IErrorProp) => {
        res.status(err.code).send(err.message);
      });
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/signup", async (req: Request, res: Response) => {
  const database = getDatabase();
  const auth = getAuth();
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    throw new ParamMissingError();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userData) => {
        if (!!userData) {
          const id = userData.user.uid
          const theUser = {
            id,
            name,
            email,
          };
          await set(ref(database, "users/" + id), theUser)
            .then(() => {
              return res.status(OK).send(theUser);
            })
            .catch((err: IErrorProp) => {
              res.status(err.code).send(err.message);
            });
        }
        throw new FirebaseNoDataError();
      })
      .catch((err: IErrorProp) => {
        res.status(err.code).send(err.message);
      });
  }
});

export default router;

import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";

// Constants
const router = Router();
const { OK } = StatusCodes;

// Get user profile data
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", (req: Request, res: Response) => {
  return res.status(OK).send(JSON.stringify(req.oidc.user)).end();
});

export default router;

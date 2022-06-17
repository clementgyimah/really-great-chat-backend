import { Request, Response, Router } from "express";
import StatusCodes from "http-status-codes";
import { requiresAuth} from 'express-openid-connect';

// Constants
const router = Router();
const { OK } = StatusCodes;

// Get user profile data
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', requiresAuth(), (req: Request, res: Response) => {
    res.status(OK).send(JSON.stringify(req.oidc.user)).end();
    return res.status(OK).end();
  });

export default router;
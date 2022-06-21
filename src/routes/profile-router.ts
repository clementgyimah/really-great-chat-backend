import { Request, Response, Router } from "express";
import SocketIO from 'socket.io';

// Constants
const router = Router();

// Get user profile data

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.post("/useronline", (req: Request, _: Response) => {
  const io: SocketIO.Server = req.app.get('socketio');
  const {userData} = req.body;

  console.log('Online user: ', userData);
  io.sockets.emit('usersonline', {userData})
  return;
});

export default router;

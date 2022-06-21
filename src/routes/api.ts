import { Router } from 'express';
import chatRouter from './chat-router';
import profileRouter from './profile-router';


// Init
const apiRouter = Router();

// Add api routes
apiRouter.use('/chat', chatRouter);
apiRouter.use('/profile', profileRouter)

// Export default
export default apiRouter;

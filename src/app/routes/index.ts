import express from 'express';
import { UserRoutes } from '../user/user.routes';

const router = express.Router();

const moduleRoutes = [
    {
    path: '/user',
    route: UserRoutes
  },
  {
    path: '/admin',
    route: UserRoutes
  }

]


moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
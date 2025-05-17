import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SpecialtyRoutes } from '../modules/specialties/specialties.route';
import { DoctorRoutes } from '../modules/Doctor/doctor.route';


const router = express.Router();

const moduleRoutes = [
    {
    path: '/user',
    route: UserRoutes
  },
  {
    path: '/admin',
    route: AdminRoutes
  },
  {
    path: '/auth',
    route: AuthRoutes
  },
   {
    path: '/specialty',
    route: SpecialtyRoutes
  },
   {
    path: '/doctor',
    route: DoctorRoutes
  }

]


moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
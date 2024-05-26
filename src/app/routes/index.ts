import express from "express";
import { UserRoutes } from "../modules/Users/user.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { AuthRouters } from "../modules/Auth/auth.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRouters,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;

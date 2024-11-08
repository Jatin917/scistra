import { Router } from "express";
import { adminRoute } from "./admin/adminRoute.js";
import { clientRoute } from "./client/clientRoute.js";
import { authRouter } from "./auth/auth.js";

export const route = Router();
route.use("/admin", adminRoute);
route.use("/client", clientRoute);
route.use("/auth", authRouter)
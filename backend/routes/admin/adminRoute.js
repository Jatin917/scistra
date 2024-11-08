import { Router } from "express";
import { blogRoute } from "./blogs/blogRoute.js";
import { courseRoute } from "./course/courseRoute.js";
import { blogMiddleware } from "./blogMiddleware/blogMiddleware.js";

export const adminRoute = Router();

adminRoute.use("/blog", blogMiddleware);
adminRoute.use("/course", blogMiddleware);
adminRoute.use("/blog", blogRoute);
adminRoute.use("/course", courseRoute);
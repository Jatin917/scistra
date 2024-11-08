import { Router } from "express";
import { blogRoute } from "./blogs/blogRoute.js";
import { courseRoute } from "./course/courseRoute.js";

export const clientRoute = Router();

clientRoute.use("/blog", blogRoute);
clientRoute.use("/course", courseRoute);
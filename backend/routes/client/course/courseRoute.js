import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const courseRoute = Router();
const prisma = new PrismaClient();

courseRoute.get("/getall", async(req, res)=>{
    try {
        const response = await prisma.course.findMany({});
        if(!response) return res.status(409).json({
            message:"bad request"
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})
courseRoute.get("/get/:id", async(req, res)=>{
    try {
        const id = req.params.id;
        const response = await prisma.course.findFirst({
            where:{
                id
            }
        });
        if(!response) return res.status(409).json({
            message:"bad request"
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})

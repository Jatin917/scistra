import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const blogRoute = Router();

const prisma = new PrismaClient();

blogRoute.get("/getall", async(req, res)=>{
    try {
        const response = await prisma.blogPosts.findMany({});
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
blogRoute.get("/get/:id", async(req, res)=>{
    try {
        const id = req.params.id;
        const response = await prisma.blogPosts.findFirst({
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

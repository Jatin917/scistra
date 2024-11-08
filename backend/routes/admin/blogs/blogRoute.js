import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const blogRoute = Router();
const prisma = new PrismaClient();
blogRoute.post("/add", async(req, res)=>{
    try {
        const userId = req.userId;
        const {title, content} = req.body;
        const exist = await prisma.blogPosts.findFirst({
            where:{
                title
            }
        });
        if(exist) return res.status(409).json({
            message:"Already exist with same title"
        })
        const response = await prisma.blogPosts.create({
            data:{
                admin_id:userId,
                title,
                content,
            }
        });
        if(!response) return res.status(400).json({
            message:"Bad Request"
        });
        return res.status(200).json({
            message:"Successfully Published"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
    
})
blogRoute.put("/edit/:id", async (req, res)=>{
    try {
        const id = req.params.id;
        const { title, content } = await req.body;
        const response = await prisma.blogPosts.update({
            where:{
                id
            },
            data:{
                title,
                content
            }
        });
        if(!response) return res.status(409).json({
            message:"bad request"
        });
        return res.status(200).json({
            message:"Updated"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})
blogRoute.delete("/delete/:id", async (req, res)=>{
    try {
        const id = req.params.id;
        const response = await prisma.blogPosts.delete({
            where:{
                id
            }
        });
        if(!response) return res.status(409).json({
            message:"bad request"
        });
        return res.status(200).json({
            message:"deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})
blogRoute.post("/schedule", async (req, res)=>{
    try {
        const { date, month, year, hour, sec } = req.body;
    } catch (error) {
        
    }
})
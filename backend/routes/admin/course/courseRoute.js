import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const courseRoute = Router();
const prisma = new PrismaClient();
courseRoute.post("/add", async(req, res)=>{
    try {
        const userId = req.userId;
        const {title, discription, price, discount} = req.body;
        const exist = await prisma.course.findFirst({
            where:{
                title,
                price,
                discount
            }
        });
        if(exist) return res.status(409).json({
            message:"Already exist with same title"
        })
        const response = await prisma.course.create({
            data:{
                admin_id:userId,
                title,
                discription,
                price,
                discount
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
courseRoute.put("/edit/:id", async(req, res)=>{
    try {
        const id = req.params.id;
        const { title, discription, price, discount } = req.body;
        const response = await prisma.course.update({
            where:{
                id
            },
            data:{
                title,
                discription,
                price,
                discount
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
courseRoute.delete("/delete/:id", async(req, res)=>{
    try {
        const id = req.params.id;
        const response = await prisma.course.delete({
            where:{
                id
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
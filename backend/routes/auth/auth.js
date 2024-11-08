import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'

export const authRouter = Router();
const prisma = new PrismaClient();

authRouter.get('/',async (req, res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const response = jwt.verify(token, process.env.SECRET_KEY);
        if(!response) return res.status(409).json({isAdmin:false});
        const user = await prisma.user.findFirst({
            where:{
                id:response
            }
        });
        return res.status(200).json({
            isAdmin:user.role==="ADMIN",
            email:user.email
        })
    } catch (error) {
        console.log(error.message);
    }
})

authRouter.post("/signup", async (req, res)=>{
    try {
        const body = req.body;
        let {email, password, role} = body;
        role = role && role.toUpperCase();
        const exist = await prisma.user.findFirst({
            where:{
                email
            }
        });
        if(exist){
            return res.json({
                status:401,
                message:"User Exist"
            })
        }
        const response = await prisma.user.create({
            data:{
                email,
                password,
                role
            }
        });
        // console.log(response);
        const token = jwt.sign(response.id, process.env.SECRET_KEY);
        
        return res.json({
            response,
            status:200,
            jwt: token
        })
    } catch (error) {
        console.log(error.message);
    }
})
authRouter.post("/signin", async(req, res)=>{    
    try {
        let {email, password, role} = req.body;
        role = role && role.toUpperCase();
        const response = await prisma.user.findFirst({
            where:{
                email,
                password
            }
        });
        if(!response) return res.json({
            status:404,
            message:"Wrong Email or Password or Role"
        });
        const token = jwt.sign(response.id, process.env.SECRET_KEY);
        
        return res.json({
            status:200,
            jwt: token
        })
    } catch (error) {
        return res.json({
            status:error.status,
            message:error.message
        })
    }
})
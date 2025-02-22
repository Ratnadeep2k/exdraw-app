
import { JWT_SECRET } from '@repo/backend-common/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import {CreateUserSchema ,SignInSchema ,CreateRoomSchema} from '@repo/common/types'
import {prismaClient} from '@repo/db/client'
const app = express();
app.use(express.json());

app.post('/signup',async (req,res)=>{
    const parshedData =CreateUserSchema.safeParse(req.body);
    if(!parshedData.success){
        res.status(400).json({
            message: "zod validation failed"
        })
        return;
    }
    try{
        const user = await prismaClient.user.create({
            data:{
                email:parshedData.data?.username,
                password:parshedData.data.password,
                name : parshedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
    }
    catch(e){
        res.status(500).json({
            message: "Username not unique"
        })
    }
})
app.post('/login', async (req,res)=>{
   
    const data = SignInSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            message: "Invalid data"
        })
        return;
    }
    const user = await prismaClient.user.findFirst({
        where:{
            email: data.data.username,
            password : data.data.password
        }
    })
    if(!user){
        res.status(401).json({
            message: "Invalid credentials"
        })
        return;
    }
    const token = jwt.sign({
         userId : user?.id
    },JWT_SECRET)
    res.json({
        token
    })
})

app.post('/room',middleware ,async (req,res)=>{
    const parsedData =CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            message: "Invalid data"
        })
        return;
    }
    //dbCall 
    
    //@ts-ignore : TODO :FIX THIS 
    const userId = req.userId ;

   try{
    const room = await prismaClient.room.create({
        data:{
            slug: parsedData.data.name,
            adminId: userId,
        }
    })
    res.json({
        roomId: room.id,
    })
   }
    catch(e){
         res.status(500).json({
              message: "Room name not unique"
         })
    }

})

app.listen(3001);
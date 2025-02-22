
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
app.post('/login',(req,res)=>{
   
    const data = SignInSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            message: "Invalid data"
        })
        return;
    }
    const userId =1;
    const token = jwt.sign({
        userId,

    },JWT_SECRET)
    res.json({token})
})

app.post('/room',middleware ,(req,res)=>{
    const data =CreateRoomSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            message: "Invalid data"
        })
        return;
    }

    //dbCall 
    res.json({
        roomId : 123
    })

})

app.listen(3001);
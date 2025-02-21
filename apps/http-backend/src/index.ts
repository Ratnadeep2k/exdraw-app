
import {JWT_SECRET} from '@repo/backend-common/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import {CreateUserSchema} from '@repo/common/types'
const app = express();
app.post('/signup',(req,res)=>{
    //dbCall
    const data =CreateUserSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({
            message: "Invalid data"
        })
        return;
    }

    res.json({
        userId: "123"
    })

})


app.post('/login',(req,res)=>{
    const userId =1;
    const token = jwt.sign({
        userId,

    },JWT_SECRET)
    res.json({token})
})

app.post('/room',middleware ,(req,res)=>{

    //dbCall 
    res.json({
        roomId : 123
    })

})

app.listen(3001);
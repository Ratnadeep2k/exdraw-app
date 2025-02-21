import { JWT_SECRET } from '@repo/backend-common/config';

import {WebSocketServer} from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';




const wss = new WebSocketServer({port: 8080});
wss.on('connection',function connection(ws ,request){
    const url  = request.url; // ws://localhost:8080/token=123123
    //[ws://localhost:8080,token = 123123]
    if(!url){
        return ;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token =queryParams.get('token') || "";
    const decoded = jwt.verify(token, JWT_SECRET);
    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return
    }
    ws.on('message',function message(data){
        ws.send('something');
    });
})

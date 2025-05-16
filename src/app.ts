import express, { Application, Request, Response } from 'express';

import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.routes';


const app:Application = express();
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req: Request, res:Response)=>{
    res.send("Hello World!")
})


app.use('/api/v1/user', UserRoutes)

export default app;
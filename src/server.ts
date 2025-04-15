import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globlalErrorHandler from './globalErrorHandler/globalErrorHandler';
import path from 'path';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(cors())
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

app.use('/api/v1', router);
app.use(globlalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'error',
    message: 'Api not Found',
    error:{
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      statusCode: httpStatus.BAD_REQUEST,
    }
  
  });
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World!');
}
);
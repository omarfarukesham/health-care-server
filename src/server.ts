import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globlalErrorHandler from './globalErrorHandler/globalErrorHandler';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

app.use('/api/v1', router);

app.use(globlalErrorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);
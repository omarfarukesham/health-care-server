import express from 'express';
import cors from 'cors';
import { UserRoutes } from './app/user/user.routes';
import { AdminRoutes } from './app/Admin/admin.routes';

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/admin', AdminRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);
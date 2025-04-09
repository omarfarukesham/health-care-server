import express from 'express';
import cors from 'cors';
import { UserRoutes } from './app/user/user.routes';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());


app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

app.use('/api/v1/user', UserRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());


app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
}
);
app.get('/', (req, res) => {
  res.send('Hello World!');
}
);
import express from 'express';
import { routes } from './routes';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

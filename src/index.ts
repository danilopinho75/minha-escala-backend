import 'dotenv/config';
import express from 'express';
import { handlerErros } from './middlewares/error';
import routes from './routes/index';

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(handlerErros);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV ?? 'development'}`)
})
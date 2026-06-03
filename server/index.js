import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import doubtSolverRouter from './routes/doubtSolver.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/doubt', doubtSolverRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GyaanSetu server running on port ${PORT}`);
});
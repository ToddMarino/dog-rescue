import './config/env.js'
import express from 'express';
import cors from 'cors';


import healthRoutes from './routes/healthRoutes.js';
import dogsRoutes from './routes/dogsRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/dogs', dogsRoutes)

app.listen(5000, () => console.log('Server running on port 5000'));

import './config/env.js';
import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/healthRoutes.js';
import dogsRoutes from './routes/dogsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import breedsRoutes from './routes/breedsRoutes.js';
import gendersRoutes from './routes/gendersRoutes.js';
import intakeTypesRoutes from './routes/intakeTypesRoutes.js';
import approvalTypesRoutes from './routes/approvalTypesRoutes.js';
import behaviorTagsRoutes from './routes/behaviorTagsRoutes.js';
import locationTypesRoutes from './routes/locationTypesRoutes.js';
import roleTypesRoutes from './routes/roleTypesRoutes.js';
import sizesRoutes from './routes/sizesRoutes.js';
import statesRoutes from './routes/statesRoutes.js';
import statusesRoutes from './routes/statusesRoutes.js';
import photosRoutes from './routes/photosRoutes.js';
import dogPhotosRoutes from './routes/dogPhotosRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/dogs', dogsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/breeds', breedsRoutes);
app.use('/genders', gendersRoutes);
app.use('/intake-types', intakeTypesRoutes);
app.use('/approval-types', approvalTypesRoutes);
app.use('/behavior-tags', behaviorTagsRoutes);
app.use('/location-types', locationTypesRoutes);
app.use('/role-types', roleTypesRoutes);
app.use('/sizes', sizesRoutes);
app.use('/states', statesRoutes);
app.use('/statuses', statusesRoutes);
app.use('/photos', photosRoutes);
app.use('/dog-photos', dogPhotosRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

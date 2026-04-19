import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';
import {
  createProfile,
  assignUserRoles,
  assignUserApprovals,
} from '../queries/userQueries.js';


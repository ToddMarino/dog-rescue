import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';
import {
  sqlCreateUser,
  createProfile,
  assignUserRoles,
  assignUserApprovals,
} from '../queries/userQueries.js';

// POST - Create User
// Public Access - /auth/signup
export const createUser = async (req, res) => {
  const client = await pool.connect();

  try {
    // 1. Start a database transaction.
    //    If any insert fails, we rollback
    await client.query('BEGIN');
    const { email, password, confirmedPassword } = req.body;

    // 2. Check if the email is null or "" and then check if the email exists
    if (email === null || email === '') {
      return res
        .status(400)
        .json({ message: 'You must include a valid email' });
    }

    const result = await client.query(
      `SELECT email FROM users where email = $1;`,
      [email],
    );

    // 3. Preform password validation checks.

    // A) Is the password null or an empty string?
    if (
      password === null ||
      password === '' ||
      confirmedPassword === null ||
      confirmedPassword === ''
    ) {
      return res
        .status(400)
        .json({ message: 'You must create and confirm a password ' });
    }

    // B) Does password and confirmed password match?
    if (password !== confirmedPassword) {
      return res.status(400).json({ message: 'Passwords did not match' });
    }

    // C) Does the password meet requirements (length, special characters, numbers, etc)?
    // minimum 8 characters
    // must haves: letters, at least one Upper case letter, a number, a special character
    // special characters: ! @ # $ % ^ & *
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            'Password must be at least 8 characters include letters and at least one upper case letter, one number, and one special character.',
        });
    }

    // 4. insert new user email & password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await client.query(sqlCreateUser, [email, hashedPassword]);

    // if all inserts work, commit the transaction
    await client.query('COMMIT');
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('USER_POST_ERROR');

    res.status(500).json({
      status: 'error',
      message: 'Failed to create new user',
      code: 'USER_POST_ERROR',
    });
  } finally {
    client.release();
  }
};

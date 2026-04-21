import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';
import { createProfile, assignUserRoles } from '../queries/userQueries.js';

// -----------------------------------------------------
// ---------------- Assign User Roles ------------------
// Admin Access - /users/assign-role
// -----------------------------------------------------
export const assignRoles = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { user_id, role_id } = req.body;

    if (!user_id || !role_id) {
      return res
        .status(400)
        .json({ message: 'The user_id and role_id are required' });
    }

    const userResult = await client.query(
      `SELECT user_id FROM users WHERE user_id = $1`,
      [user_id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const roleResult = await client.query(
      `SELECT role_id FROM role_types WHERE role_id = $1`,
      [role_id],
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const userId = userResult.rows[0].user_id;
    const roleId = roleResult.rows[0].role_id;

    await client.query(assignUserRoles, [userId, roleId]);

    // if all inserts work, commit the transaction
    await client.query('COMMIT');
    return res.status(201).json({ message: 'User roles assigned' });
  } catch (err) {
    // if anything fails, stop and rollback the database
    await client.query('ROLLBACK');

    console.error('ROLE_ASSIGNMENT_ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to assign role',
      code: 'ROLE_ASSIGNMENT_ERROR',
    });
  } finally {
    client.release();
  }
};

// -----------------------------------------------------
// ----------- Automatic Sync of User Roles ------------
// -----------------------------------------------------
export const syncApprovalsForRole = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Validate Input.
    // Check for data
    const { user_id, role_id } = req.body;
    if (!user_id || !role_id) {
      return res
        .status(400)
        .json({ message: 'Both User ID and Role ID required' });
    }

    // then check the data exists in the db.
    const userResult = await client.query(
      `SELECT user_id FROM users WHERE user_id = $1`,
      [user_id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User ID not found' });
    }

    const roleResult = await client.query(
      `SELECT role_id FROM role_types WHERE role_id = $1`,
      [role_id],
    );
    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Role ID not found' });
    }

    // Assign user_id & role_id to variables.
    const userId = userResult.rows[0].user_id;
    const roleId = roleResult.rows[0].role_id;

    // 2. Get the default approvals for this role.
    const defaultResults = await client.query(`
      SELECT role_id, approval_type_id
      FROM role_default_approvals
      WHERE role_id = $1
      `, [roleId]);
    
    const defaultApprovalIds = defaultResults.rows.map(r => r.approval_type_id);
    // defaultApprovalIds should be something like [3,8,10]
    // next find what roles, if any, the user currently has

    // 3. Get current approvals for this user.
    const currentResults = await client.query(`
      SELECT approval_type_id
      FROM user_approvals
      WHERE user_id = $1
      `, [userId]);
    
    const currentApprovalIds = currentResults.rows.map(r => r.approval_type_id)

    // 4. Compare what approvals to add to user
    // what default approvals are missing in current
    const toAdd = defaultApprovalIds.filter(id => !currentApprovalIds.includes(id));

    // 5. Find what current approvals should not be in current
    const toRemove = currentApprovalIds.filter(id => !defaultApprovalIds.includes(id));

    // 6. Add the missing approvals into user_approvals
    if (toAdd.length > 0) {
      for (const approvalId of toAdd) {
        await client.query(`
          INSERT INTO user_approvals(user_id, approval_type_id)
          VALUES ($1, $2)
          `, [userId, approvalId])
      }
    }

    // 7. Delete the extra approvals from  user_approvals
    if (toRemove.length > 0) {
      for (const approvalId of toRemove) {
        await client.query(`
          DELETE FROM user_approvals
          WHERE user_id = $1 AND approval_type_id = $2
          `, [userId, approvalId])
      }
    }

    // 8. Commit the transaction
    await client.query('COMMIT');

  } catch (err) {
    // if anything fails, stop and rollback the database
    await client.query('ROLLBACK');

    console.error('ROLE_ASSIGNMENT_ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Automatic role assignment failed',
      code: 'ROLE_ASSIGNMENT_ERROR',
    });
  } finally {
    client.release();
  }
};

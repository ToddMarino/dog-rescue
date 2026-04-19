// POST User
// Public
export const sqlCreateUser = `
INSERT INTO users (email, password_hash)
VALUES ($1, $2)
RETURNING user_id
`;

// POST User Roles
// Admin or Super Admin
export const assignUserRoles = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;
`;

// POST User Approvals
// Admin or Super Admin
export const assignUserApprovals = `
    INSERT INTO user_approvals (user_id, approval_type_id, approved_by)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING;
`;

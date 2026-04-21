// POST User Profile
// User 
export const createProfile = `
INSERT INTO users_data (
    user_id,
    first_name,
    last_name,
    phone_number,
    address_id
)
VALUES ($1, $2, $3, $4, $5)
RETURNING user_id
`;


// POST User Roles
// Admin
export const assignUserRoles = `
INSERT INTO user_roles (
    user_id,
    role_id
)
VALUES ($1, $2)
RETURNING user_id, role_id
`;

// POST Automatic Assignment of Approvals base on Role
export const syncApprovalsForRole = (filter = '') => `
SELECT role_id, approval_type_id
FROM role_default_approvals
${filter}
ORDER BY role_id
`;

export const sqlSync = syncApprovalsForRole(`WHERE role_id = $1`);



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



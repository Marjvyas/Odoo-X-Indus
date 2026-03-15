const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user.
 * @param {string} id - User's MongoDB _id
 * @param {string} role - User's role ('owner' or 'employee')
 * @returns {string} Signed JWT
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;

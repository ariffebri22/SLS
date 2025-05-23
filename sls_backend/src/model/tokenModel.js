const pool = require("../config/db");
const xss = require("xss");

const saveReverifyToken = async ({ email, token }) => {
    const cleanEmail = xss(email);
    const cleanToken = xss(token);

    const query = `
    INSERT INTO ReverifyToken (id, email, token)
    VALUES (UUID(), ?, ?)
  `;
    await pool.execute(query, [cleanEmail, cleanToken]);
};

const findReverifyToken = async (token) => {
    const cleanToken = xss(token);
    const query = `SELECT * FROM ReverifyToken WHERE token = ?`;
    const [result] = await pool.execute(query, [cleanToken]);
    return result[0];
};

const deleteReverifyToken = async (token) => {
    const cleanToken = xss(token);
    const query = `DELETE FROM ReverifyToken WHERE token = ?`;
    await pool.execute(query, [cleanToken]);
};

const saveVerificationToken = async ({ email, token }) => {
    const cleanEmail = xss(email);
    const cleanToken = xss(token);

    const query = `
      INSERT INTO EmailVerification (id, email, token)
      VALUES (UUID(), ?, ?)
    `;
    await pool.execute(query, [cleanEmail, cleanToken]);
};

module.exports = {
    saveReverifyToken,
    findReverifyToken,
    deleteReverifyToken,
    saveVerificationToken,
};

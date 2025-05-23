const pool = require("../config/db");
const xss = require("xss");

const getUserByEmail = async (email) => {
    const cleanEmail = xss(email);
    try {
        const query = "SELECT * FROM User WHERE email = ?";
        const [result] = await pool.execute(query, [cleanEmail]);
        return result[0];
    } catch (err) {
        console.error("Error getUserByEmail:", err);
        throw err;
    }
};

const createUser = async ({ name, email, passwordHash }) => {
    const cleanName = xss(name);
    const cleanEmail = xss(email);

    try {
        const query = `
      INSERT INTO User (id, name, email, password, emailVerified, loginAttempts)
      VALUES (UUID(), ?, ?, ?, NULL, 0)
    `;
        const now = new Date();
        const [result] = await pool.execute(query, [
            cleanName,
            cleanEmail,
            passwordHash,
        ]);

        return result.insertId;
    } catch (err) {
        console.error("Error createUser:", err);
        throw err;
    }
};

const updateLoginFailure = async (email, attempts) => {
    const cleanEmail = xss(email);
    const now = new Date();
    const query = `
      UPDATE User SET loginAttempts = ?, lastFailedLoginAt = ?
      WHERE email = ?
    `;
    await pool.execute(query, [attempts, now, cleanEmail]);
};

const resetLoginAttempts = async (email) => {
    const cleanEmail = xss(email);
    const query = `
      UPDATE User SET loginAttempts = 0, lastFailedLoginAt = NULL
      WHERE email = ?
    `;
    await pool.execute(query, [cleanEmail]);
};

const disableUserVerification = async (email) => {
    const cleanEmail = xss(email);
    const query = `
      UPDATE User SET emailVerified = NULL WHERE email = ?
    `;
    await pool.execute(query, [cleanEmail]);
};

const verifyEmailNow = async (email) => {
    const cleanEmail = xss(email);
    const now = new Date();
    const query = `
      UPDATE User SET emailVerified = ? WHERE email = ?
    `;
    await pool.execute(query, [now, cleanEmail]);
};

module.exports = {
    getUserByEmail,
    createUser,
    updateLoginFailure,
    resetLoginAttempts,
    disableUserVerification,
    verifyEmailNow,
};

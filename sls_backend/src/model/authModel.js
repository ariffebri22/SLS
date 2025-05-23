const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const xss = require("xss");

const findUserByEmail = async (email) => {
    const newEmail = xss(email);
    try {
        const queryString = `SELECT * FROM User WHERE email = ?`;
        const [result] = await pool.execute(queryString, [newEmail]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const insertResetToken = async (userId, expiresAt) => {
    const newUserId = xss(userId);
    const newsExpires = xss(expiresAt);
    try {
        const id = uuidv4();
        const token = uuidv4();
        const queryString = `
            INSERT INTO reset_tokens (id, user_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        `;
        const values = [id, newUserId, token, newsExpires];
        const [result] = await pool.execute(queryString, values);
        return { result, token };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getResetToken = async (token) => {
    const newToken = xss(token);
    try {
        const queryString = "SELECT * FROM reset_tokens WHERE token = ?";
        const [result] = await pool.execute(queryString, [newToken]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const updatePassword = async (userId, hashedPassword) => {
    const newUserId = xss(userId);
    const newsHashed = xss(hashedPassword);
    try {
        const queryString = "UPDATE User SET password = ? WHERE id = ?";
        const values = [newsHashed, newUserId];
        const [result] = await pool.execute(queryString, values);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const deleteResetToken = async (token) => {
    const newToken = xss(token);
    try {
        const queryString = "DELETE FROM reset_tokens WHERE token = ?";
        const [result] = await pool.execute(queryString, [newToken]);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getActiveResetTokenByUserId = async (userId) => {
    const newUserId = xss(userId);
    try {
        const query = `
            SELECT * FROM reset_tokens
            WHERE user_id = ? AND expires_at > NOW()
            LIMIT 1
        `;
        const [result] = await pool.execute(query, [newUserId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    findUserByEmail,
    insertResetToken,
    getResetToken,
    updatePassword,
    deleteResetToken,
    getActiveResetTokenByUserId,
};

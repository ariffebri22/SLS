const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const xss = require("xss");

const insertLoginSession = async ({
    user_id,
    email,
    username,
    ip_address,
    device_info,
}) => {
    try {
        const id = uuidv4();
        const query = `
            INSERT INTO login_sessions (
                id, user_id, email, username, ip_address, device_info
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            xss(id),
            xss(user_id),
            xss(email),
            xss(username),
            xss(ip_address),
            xss(device_info),
        ];

        const [result] = await pool.execute(query, values);
        return { id, result };
    } catch (error) {
        console.error("insertLoginSession error:", error);
        throw error;
    }
};

const updateLogoutSession = async (session_id) => {
    const newSession = xss(session_id);
    try {
        const query = `
            UPDATE login_sessions
            SET 
                logout_time = CURRENT_TIMESTAMP,
                login_duration = TIMEDIFF(CURRENT_TIMESTAMP, login_time),
                status_login = 'inactive'
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [newSession]);
        return result;
    } catch (error) {
        console.error("updateLogoutSession error:", error);
        throw error;
    }
};

module.exports = {
    insertLoginSession,
    updateLogoutSession,
};

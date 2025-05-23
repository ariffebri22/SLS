const {
    insertLoginSession,
    updateLogoutSession,
} = require("../model/loginSessionModel");

const SessionController = {
    storeLoginSession: async (req, res) => {
        try {
            const { user_id, email, username, ip_address, device_info } =
                req.body;

            console.log({
                user_id,
                email,
                username,
                ip_address,
                device_info,
            });

            if (!user_id || !email || !username) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing required data to store session",
                });
            }

            const { id } = await insertLoginSession({
                user_id,
                email,
                username,
                ip_address,
                device_info,
            });

            return res.status(200).json({
                status: 200,
                message: "Login session stored successfully",
                session_id: id,
            });
        } catch (err) {
            console.error("storeLoginSession error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },

    updateLogoutSession: async (req, res) => {
        try {
            const { session_id } = req.body;

            if (!session_id) {
                return res.status(400).json({
                    status: 400,
                    message: "Session ID is required to logout",
                });
            }

            await updateLogoutSession(session_id);

            return res.status(200).json({
                status: 200,
                message: "Logout session updated successfully",
            });
        } catch (err) {
            console.error("updateLogoutSession error:", err);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    },
};

module.exports = SessionController;

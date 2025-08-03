const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try { 
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.userId };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
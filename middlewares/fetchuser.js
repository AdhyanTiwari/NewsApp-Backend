const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
    let status = false;
    const token = req.header("auth-token");
    if (!token) {
        return res.json({ status, error: "authenticate the user " })
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        return res.json({ status, error: "Error in the auth-token" })
    }

}

module.exports = fetchUser
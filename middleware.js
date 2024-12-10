const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || authHeader.length == 0 || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: `Authentication header invalid try to login and get Auth token then use it`,
            authHeader
        })
    }

    const token = authHeader.split(' ')[1]
    const parts = token.split('.')
    if(parts.length !== 3)
        return res.json({
            error: "jwt token invalid"
        })
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.user_id) {
            req.user_id = decoded.user_id;
            next();
        } else {
            res.json({
                msg : "decoded userId mismatch"
            })
        }
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}

module.exports = {
    authMiddleware
}
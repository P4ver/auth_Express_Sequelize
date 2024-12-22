const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next)=>{
    const token = req.cookies.token;

    if (!token) return res.status(401).json({message: 'Access denied, no token provided'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decoded);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("Error in verifyToken, ",err);
        return res.status(500).json({message: 'verify token: server error'});
    }
}
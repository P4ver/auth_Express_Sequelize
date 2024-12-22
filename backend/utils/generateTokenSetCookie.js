// const jwt = require('jsonwebtoken')

// exports.generateTokenSetCookie = (res, userId)=>{
//     const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
// }
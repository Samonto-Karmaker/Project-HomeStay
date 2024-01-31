//External imports
const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    let cookies = Object.keys(req.signedCookies).length === 0 ? null : req.signedCookies;
    if(cookies) {
        try{
            token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch(err){
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    else{
        res.status(401).json({
            success: false,
            message: 'Unauthorized access',
        });
    }
}

module.exports = {
    checkAuth
}
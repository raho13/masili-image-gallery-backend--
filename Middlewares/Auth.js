const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
    const token = req.header("auth");
    if (!token) {
        return res.status(401).send("Access Denide")
    }
    else {
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next()
        } catch (err) {
            res.send("Invalid Token").status(401)
        }
    }

}
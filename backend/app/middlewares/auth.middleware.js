// import dependencies
const { verify } = require('jsonwebtoken');
const Admin = require('../models/student.model');

async function auth(req, res, next) {
    const header = req.header('Authorization')
    const token = header ? header.split(' ')[1] : req.query.token;
    if (!token)
        return res.status(401).send({message:'No Token Found'})
    try {
        const decoded = verify(token, process.env.JWT_SECRET)
        const user = await Admin.findByPk(decoded.id);
        if (!user)
            return res.status(401).send({message:'Invalid Token'})
        req.user = user
        next();
    }
    catch (err) {
        res.status(401).send({message:"Unauthorized"})
        console.log(err);
    }
}
module.exports.auth = auth
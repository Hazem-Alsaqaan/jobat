const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")


const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization
    if(!token){
        res.status(400).json({message: "we need token"})
    }else{
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user)=>{
            if(err){
                res.status(400).json({message: "this token isn't valid"})
            }
            req.user = user
            next()
        })
    }
}

module.exports = {verifyToken}
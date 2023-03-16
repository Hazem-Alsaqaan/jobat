const {check} = require("express-validator")
const { validationMiddleware } = require("./validationMiddleware")

const userValidator = [
    check("email").isEmail().isString().trim().isLength({min: 8, max: 32}),
    check("password").isString().trim().isLength({min: 6, max: 500}),
    validationMiddleware
]

module.exports = {userValidator}
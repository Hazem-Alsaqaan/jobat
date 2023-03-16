const mongoose = require("mongoose")
const dotenv = require('dotenv')

dotenv.config({
    path: ".env"
})
const {db_url} = process.env

mongoose.connect(db_url)
.then(()=> console.log("The Server Succeded To Connection With db"))
.catch((err)=>console.log(`The Server Failed To Connection With db ${err}`))
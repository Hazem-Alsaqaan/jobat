const express = require ("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const db = require("./db")
const ApiError = require("./src/utilities/ApiError")
const { userRouter } = require("./src/route/userRouter")
const consultingRouter = require("./src/route/consulting.route")

const app = express()

app.use(express.json())
app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}))

app.use(cors())

//routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/consulting", consultingRouter)
//global route if not found
app.all("*", (req, res, next)=>{
    next(new ApiError(`incorrect route ${req.originalUrl}`, 404))
})
app.use((err, req, res, next)=>{
    res.status(err.statusCode).json({
        messagee: err.message,
        stack: err.stack
    })
})

dotenv.config({
    path: ".env"
})
const {PORT} = process.env

app.listen(PORT, ()=> console.log(`back-end Server is running.......`))
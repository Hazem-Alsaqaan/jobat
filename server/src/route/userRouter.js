const userRouter = require("express").Router()
const {
    registerUser,
    loginUser,
    getUsers,
    deleteUser,
    getOneUsers,
    updateUser,
    handleUploading,
} = require("../controller/userController")
const fileUpload = require("../utilities/uploadPictures")
const { userValidator } = require("../utilities/validators/userValidator")
const { verifyToken } = require("../utilities/verifyToken")


userRouter.post("/register", userValidator, registerUser)
userRouter.post("/login", userValidator, loginUser)
userRouter.get("/",getUsers)
userRouter.get("/:id",getOneUsers)
userRouter.delete("/:id", verifyToken, deleteUser)
userRouter.patch("/:id", userValidator, verifyToken, updateUser)
userRouter.post("/upload", verifyToken, fileUpload.single("image"), handleUploading)
//Nested Router Which Specific Cases Route

module.exports = {userRouter}
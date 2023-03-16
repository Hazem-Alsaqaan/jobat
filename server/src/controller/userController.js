const ApiError = require("../utilities/ApiError")
const bcrypt = require("bcrypt")
const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")
const { uploadCloudinary, removeFromCloudinary } = require("../utilities/cloudinary")

dotenv.config({
    path: ".env"
})
// ---------------------------------------
// @des          register user
// @method       post
// @route        /api/v1/users/rgister
// ---------------------------------------
const registerUser = async (req, res, next)=>{
    let {username, email, password} = req.body
    try{
        const user = await userModel.findOne({email})
        if(user){
            res.status(409).send("this email is already found please change it and try again")
        }else{
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            password = await bcrypt.hash(password, salt)
            const newUser = await userModel.create({username, email, password})
            const accessToken = jwt.sign({id: newUser._id},process.env.TOKEN_SECRET_KEY, {expiresIn: "15m"})
            res.status(201).json({user:newUser, token:accessToken})
        }
    }catch(err){
        next(new ApiError(`Sorry To Add This User${err}`, 406))
    }
}
// ---------------------------------------
// @des          login user
// @method       post
// @route        /api/v1/users/login
// ---------------------------------------
const loginUser = async (req, res, next)=>{
    const {email, password} = req.body
    try{
        const user = await userModel.findOne({email})
        if(!user){
            res.status(405).json("this user didn't register")
        }else{
            const checkPassword = await bcrypt.compare(password, user.password)
            if(checkPassword){     
                const accessToken = jwt.sign({id: user._id}, process.env.TOKEN_SECRET_KEY)
                return res.status(200).json({user: user, token:accessToken})
            }else{
                res.status(404).json("check email or password")
            }
        }
    }catch(err){
        next (new ApiError(`Sorry Login User ${err}`, 401))
    }
}

// ---------------------------------------
// @des          get all users
// @method       get
// @route        /api/v1/users
// ---------------------------------------
const getUsers = async (req, res, next)=>{
    try{
        const users = await userModel.find()
        if(!users){
            res.status(404).send("users Not Found")
        }else{
            res.status(200).json(users)
        }
    }catch(err){
        next(new ApiError(`Sorry get users ${err}`, 400))
    }
}
// ---------------------------------------
// @des          get user
// @method       get
// @route        /api/v1/users/:id
// ---------------------------------------
const getOneUsers = async (req, res, next)=>{
    const {id} = req.params
    try{
        const user = await userModel.findById(id)
        if(!user){
            res.status(404).send("user Not Found")
        }else{
            res.status(200).json(user)
        }
    }catch(err){
        next(new ApiError(`Sorry get this user ${err}`, 400))
    }
}

// ---------------------------------------
// @des          delete user
// @method       delete
// @route        /api/v1/users/:id
// ---------------------------------------
const deleteUser = async(req, res, next)=>{
    const {id} = req.params
        try{
            if(req.user.id === id){
                const user = await userModel.findByIdAndDelete(id)
                res.status(202).json(user)
            }else{
                res.status(400).json({message: "you are not authorization to delete user"})
            }
        }catch(err){
            next (new ApiError(`Sorry to delete this user ${err}`, 400))
        }
}

// ---------------------------------------
// @des          update user
// @method       patch
// @route        /api/v1/users/:id
// ---------------------------------------
const updateUser = async(req, res, next)=>{
    const {id} = req.params
    const {username, email,password, picture} = req.body
    try{
        if(req.user.id !== id){
            res.status(403).json("you are not authorization to update user")
        }else{
            const user = await userModel.findByIdAndUpdate(
                id, 
                {username, email, password, picture},
                {new: true}
                )
            res.status(200).json(user)
        }
    }catch(err){
        next (new ApiError(`can't update user ${err}`))
    }
}
//----------------------------------
// @des        upload pictue
// @metod      post
// @route      /api/v1/upload
//----------------------------------
const handleUploading = async(req, res, next)=>{
    const accessFile =  path.join(__dirname, `../../assets/${req.file.filename}`)
    try{
        const result = await uploadCloudinary(accessFile)
        const user = await userModel.findOne(req.user)
        if(user.picture.plublicId !== null){
            await removeFromCloudinary(user.picture.plublicId)
        }
        user.picture = {
            url: result.secure_url,
            publicId: result.public_id
        }
        await user.save()
        res.status(200).json({message: "your picture is uploaded"})

        fs.unlinkSync(accessFile)
    }catch(err){
        next(new ApiError(`can't uploading ${err}`, 400))
    }
}

module.exports = {
        registerUser,
        loginUser,
        getUsers,
        deleteUser,
        getOneUsers,
        updateUser,
        handleUploading
    }

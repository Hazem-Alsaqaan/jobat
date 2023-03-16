const consultingModel = require("../model/consulting.model")
const ApiError = require("../utilities/ApiError")

//---------------------------------------
// @des        create a new consulting
// @method     post
// @route      /api/v1/consulting
//----------------------------------------
const createConsulting = async(req, res, next)=>{
    const {content} = req.body
    const user = req.user.id
    try{
        const consult =  await consultingModel.create({content, user})
        res.status(200).json(consult)
    }catch(err){
        next(new ApiError(`can't create a new consulting ${err}`, 400))
    }
}
//---------------------------------------
// @des        get all consulting
// @method     get
// @route      /api/v1/consulting
//----------------------------------------
const getConsulting = async(req, res, next)=>{
    try{
        const consulting = await consultingModel.find().populate({path: "user", select: "-password"})
        res.status(200).json(consulting)
    }catch(err){
        next(new ApiError(`can't get all consulting`, 400))
    }
}
//---------------------------------------
// @des        delete a consult
// @method     delete
// @route      /api/v1/consulting/:id
//----------------------------------------
const deleteConsulting = async(req, res, next)=>{
    const {id} = req.params
    const getUser = req.user
    try{
        const consult = await consultingModel.findById(id)
        if(getUser.id === consult.user.toString()){
            const consult = await consultingModel.findByIdAndDelete(id)
            res.status(200).json(consult)
        }else{
            res.status(200).json("you are not authorization to delete this consult", 400)
        }
    }catch(err){
        next(new ApiError(`can't delete this consult ${err}`, 400))
    }
}
//---------------------------------------
// @des        update a consult
// @method     patch
// @route      /api/v1/consulting/:id
//----------------------------------------
const updateConsulting = async(req, res, next)=>{
    const {id} = req.params
    const {content} = req.body
    const getUser = req.user
    try{
        const consulting = await consultingModel.findById(id).populate({path: "user", select:"-password"})
        if(!consulting){
            res.status(200).json("this consulting not found")
        }else{
            if(getUser.id === consulting.user._id.toString()){
                const updateConsulting = await consultingModel.findByIdAndUpdate(id, {content}, {new: true})
                res.status(200).json(updateConsulting)
            }else{
                res.status(403).json(`you are not authorization to update consulting ${consulting.user._id.toString()}`)
            }
        }
    }catch(err){
        next(new ApiError(`error to update this consultin${err}`, 400))
    }
}



module.exports = {
    createConsulting,
    getConsulting,
    deleteConsulting,
    updateConsulting
}



const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")

dotenv.config({
    path: ".env"
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// handle upload file to cloudinary
const uploadCloudinary = async(imageToUpload)=>{
    try{
        const data = await cloudinary.uploader.upload(imageToUpload, {
            resource_type: "auto"
        })
        return data
    }catch(err){
        console.log(err)
    }
}

//handle remove file from cloudinary
const removeFromCloudinary = async(imageToRemove)=>{
    try{
        const data = await cloudinary.uploader.destroy(imageToRemove)
        return data
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    uploadCloudinary,
    removeFromCloudinary
}



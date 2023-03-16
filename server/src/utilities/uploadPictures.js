
const multer = require("multer")
const path = require("path")

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, "../../assets"))
    },
    filename: (req, file, cb)=>{
        if(file){
            cb(null, file.originalname)
        }else{
            cb(null, false)
        }
    }
})

const fileUpload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null, true)
        }else{
            cb({message: "didn't support this file"}, false)
        }
    },
    limits: {fileSize: 1024 * 1024 * 5}
})

module.exports = fileUpload
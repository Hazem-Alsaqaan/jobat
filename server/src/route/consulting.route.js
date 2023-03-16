const consultingRouter = require("express").Router()
const { createConsulting, getConsulting, deleteConsulting, updateConsulting } = require("../controller/consulting..controller")
const { verifyToken } = require("../utilities/verifyToken")


consultingRouter.post("/", verifyToken, createConsulting)
consultingRouter.get("/", getConsulting)
consultingRouter.delete("/:id", verifyToken, deleteConsulting)
consultingRouter.patch("/:id", verifyToken, updateConsulting)

module.exports = consultingRouter
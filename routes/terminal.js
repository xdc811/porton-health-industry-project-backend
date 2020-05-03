const router = require("express").Router()
const { terminalAuth } = require('./terminalToken')
const { login, getAppointmentById } = require('../controller/terminalController')

// Post Terminal/Login
router.post("/login", async (req, res) => {
    return await login(req, res)
})

// Get Terminal/Appointment/{id}
router.get("/appointment/:appointmentId", terminalAuth, async (req, res) => {
    return await getAppointmentById(req, res)
})

// Get Terminal/test
router.get("/test", terminalAuth, async (req, res) => {
    return await res.status(200).send({ "details": req.terminal })
})

module.exports = router
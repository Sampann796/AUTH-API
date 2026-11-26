const express = require ("express");

const router = express.Router();

const {
    register,
    login,
    logout,
    data,
} = require("../controllers/authcontroller");

const auth = require("../middleware/authmiddleware");
const authmiddleware = require("../middleware/authmiddleware");

router.get("/",data);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authmiddleware, logout);


//protected route for testing   

router.get("/profile", auth, (req,res) =>{
    res.status(200).json({
        success: true,
        message: "You have accessed a protected route",
        userId : req.userId,
    })
})

module.exports = router;
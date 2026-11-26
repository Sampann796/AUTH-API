const User = require('../models/user');
const Session = require('../models/session');
const ValidSession = require('../middleware/authmiddleware');

const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const crypto = require('crypto');
const Blocked = require('../models/Blocked');

// REGISTER USER

exports.register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

            if(!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All Fields are required"
                });
            }

            if(password.length < 8){
                return res.status(400).json({
                    success: false,
                    message: "password must be at least 8 characters long"
                });
            }

            const existingUser = await User.findOne({email});

            if(existingUser){
                return res.status(409).json({
                    success: false,
                    message: "User already exists"
                });
            }

            const hashedPassWord = await bcrypt.hash(password, 12);

            const user = await User.create({
                name,
                email,
                password : hashedPassWord
            });

            return res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                user : {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
            });
    } catch (error){
        return res.status(500).json({
            success: false,
            message : error.message
        });
    }
};


// LOGIN

exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                success: false,
                message: " Invalid email or password",
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate session ID 
        const sessionID = crypto.randomUUID();

        const expiresIn = process.env.JWT_EXPIRES_IN || "15m";

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);


        // create JWT 

        
        const token =  jwt.sign({
          userId: user._id.toString(),
          sessionId: sessionID,  
        },
        process.env.JWT_SECRET, 
        {
            expiresIn, 
            jwtid: sessionID,
        }
    );


    // Save active sessions in MongoDB

    await Session.create({
        user : user._id,
        sessionId : sessionID,
        expiresAt,
    })

    return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
        }
    });
    } catch(error){
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
};

// LOGOUT

exports.logout = async (req,res) => {
    try{
        console.log('entered')

        await Session.updateOne(
            {
                sessionId : req.sessionId,
                revokedAt : null,
            },
            {
                $set : {revokedAt: new Date()},

            }
        );

        // inserting token into blocked table 
        console.log('creating table')
         await Blocked.create({
             token: req.tokenId
            });
        
        console.log("created a session under blocked ")

        console.log('created table')


        // previous logic for inserting token into blocked 

        // if(validSession && validSession.revokedAt !== null){
        //     await blocked.create({
        //         token: req.tokenId
        //     });
        // }

        // console.log(token);

        

        return res.status(200).json({
            success: true,
            message : "Logged out successfully",
            
        }); 

        

    } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message, 
            })
    }
};

exports.data = async(req,res)=>{
    console.log('it is working ');
    return res.status(200).json({
        message:"working",
    })
}




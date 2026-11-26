require ("dotenv").config();
const jwt = require("jsonwebtoken");
const Session = require ("../models/session");
const user = require("../models/user");
const { models } = require("mongoose");
const session = require("../models/session");
const blocked = require("../models/Blocked");

const authmiddleware = async (req, res, next) => {
    
    try{


        const authHeader = req.headers.authorization;

        console.log(authHeader);

        


        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({
                success: false,
                message: "Authentication token required",
            });
        }

        


        const token = authHeader.split(" ")[1];

        // checking in blocked table 

        const recheck = await blocked.findOne({token});

        if(recheck){
            console.log("rechecking")
            return res.status(401).json({
                message : "Token Expired",
                success : false 
            })
        }

        // verify JWT signature and expiration

        

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded,'Session id ');
        
        //check wheather existing session exist or not   

        const validSession = await Session.findOne ({
            user: decoded.userId,
            sessionId : decoded.sessionId,
            revokedAt: null,
        });


        console.log(validSession,"Hello");


        if(!validSession){
            return res.status(401).json({
                success: false, 
                message: "session expired",
            })
        }


        //also took it up 

        // if(validSession.revokedAt !== null){
        //             await blocked.create({
        //                 token: req.tokenId
        //             });
        //         }

        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId;
        req.tokenId = token;


        //  if(revokedAt.validSession !== null ){
        //     await blockedSchema.create({
        //         userkiID : userId,   
        //         tokenID : tokenId
        //     })
        // } 

        // const recheck = await blocked.findOne({token});         took it up 

        // if(recheck){
        //     return res.status(401).json({
        //         message : "Token Expired",
        //         success : false 
        //     })
        // }

        next();
    } catch(error){
        return res.status(400).json({
            success : false,
            message : error.message
            // error.name === "TokenExpiredError" 
            // ? "Token Expired. Please Try again."
            // : "Invalid Authentication Token",
        });
    }

} 

module.exports = authmiddleware;
// module.exports = session;
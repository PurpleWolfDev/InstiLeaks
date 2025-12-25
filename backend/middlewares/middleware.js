const {redis} = require("./../services/redis.js");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const {findUser} = require("./../services/dbFuncs.js");
require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwt_key;
async function validateFields(req, res, next) {
    next();
}
async function scanIP(req, res, next) {
            console.log("received scan");
            
            try {
                const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || req.ip;
                console.log(ip)
        let requests = await redis.incr(`rate:${ip}`);
        if(requests==1) {
            await redis.expire(`rate:${ip}`, 20);
            next();
        }
        else if(requests>20) {
            return res.json({status:429, msg:'too many requests'});
        }
        else next();
    } catch(err) {
        res.json({status:500, msg:'failed to verify IP'});
    }
}

async function scanIPv2(req, res, next) {
            console.log("received scan");
            
            try {
                const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || req.ip;
                console.log(ip)
        let requests = await redis.incr(`rate:${ip}`);
        if(requests==1) {
            await redis.expire(`rate:${ip}`,1);
            next();
        }
        else if(requests>10) {
            return res.json({status:429, msg:'too many requests'});
        }
        else next();
    } catch(err) {
        res.json({status:500, msg:'failed to verify IP'});
    }
}
async function checkExistingUsers(req, res, next) {
    
    try {
        let getValid = req.query.getReq;
        let data;
        if(getValid) {
            console.log("if1");
            data = await findUser({rollNo:((req.query?.rollNo)?req.query?.rollNo:"")});
        }
        else {
            data = await findUser({rollNo:req.body.rollNo});
            console.log("if2");
        }
        if(data.length==0) {
            console.log("if3");
            return next();
        }
        else {
            next();
            return res.json({status:400, msg:'user exists'});
            // console.log("else");
            // return;
        }
        return;
    } catch(err) {
        console.log(err)
        return res.json({
            status:500,
            msg:"internal error"
        });
    }
}

function verifyJWT(req, res, next) {
        console.log("received jwt");
    try {
        let getValid = req.query.jwtToken;
        console.log(getValid);
        console.log(req.body);
        if(getValid) {
            let data = jsonwebtoken.verify(req.query.jwtToken, jwtKey);
        }
        else {
            let data = jsonwebtoken.verify(req.body.jwtToken, jwtKey);
        }
        return next();
    } catch(err) {
        console.log(err);
        return res.json({status:400, msg:"jwt failed"});
    }   
}

module.exports = {validateFields, scanIP, checkExistingUsers, verifyJWT, scanIPv2}; 
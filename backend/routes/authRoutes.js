require("dotenv").config({
    path:__dirname+"./../.env"
});
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const {sendEmail} = require("./../services/sendEmail.js");
const authRouter = express.Router();
const {saveUser, findUser, updateUser} = require("./../services/dbFuncs.js");
const {validateFields, scanIP, checkExistingUsers, verifyJWT} = require("../middlewares/middleware.js");
const jwtKey = process.env.jwt_key;
const rounds = Number(process.env.hashing_rounds);
const {redis} = require("./../services/redis.js");
/**
 * input = name, rollNo, email, password, pfpLink : default for now,
 * bio:"",
 * badges:[],
 * blockedUsers:[]
 * activeRating:0,
 * memeRating:[],
 * 
 * 
 * 
 * 
 */
authRouter.post("/createUserAccount", validateFields, scanIP, checkExistingUsers, async(req, res) => {
    try{
        console.log("received Main");
        let data = req.body;
        let {rollNo, name} = req.body;
        console.log(data.password, typeof(rounds))
        let hashedPass = await bcrypt.hash(data.password, rounds);
        data.password = hashedPass;
        let t = new Date().getTime();
        data.createdAt = t;
        data.uId = crypto.randomInt(10000000, 99999999)+Number(rollNo.substring(3,10));
        await redis.setEx(`verifyToken:${rollNo}`, 3600, (t/100).toFixed(0));
        const otp = crypto.randomInt(1000, 9999);
        console.log(otp);
        let verifyUrl = `${process.env.frontend_link}/auth/user/verifyUserLink?token=${Number((t/100).toFixed(0))}&otp=${otp}&rollNo=${rollNo}`;
        let g = (await axios.get(`https://api.genderize.io/?name=${name}`)).data;
        console.log(g);
        data.gender = g.gender;
        let result = await saveUser(data);
        await redis.setEx(`otp:${rollNo}`, 300, String(otp));
         
          const html = `
        <!DOCTYPE html>
        <html>
          <body style="
            margin:0;
            padding:0;
            background-color:#0f0f10;
            font-family: Arial, sans-serif;
            color:#f5f5f5;
          ">
        
            <div style="
              max-width:480px;
              margin:0 auto;
              padding:24px 16px;
            ">
        
              <div style="
                background-color:#16161a;
                border-radius:16px;
                border:1px solid #2b2b33;
                padding:24px 20px;
              ">
        
                <div style="
                  text-align:center;
                  font-size:24px;
                  font-weight:800;
                  margin-bottom:6px;
                  color:#f5f5f5;
                ">
                  insti<span style="color:#6a2bed;">Leaks</span>
                </div>
        
                <div style="
                  text-align:center;
                  font-size:12px;
                  color:#aaaaaa;
                  margin-bottom:20px;
                ">
                  Verify your email to unlock the real insti feed.
                </div>
        
                <h1 style="
                  margin:0 0 12px;
                  font-size:20px;
                  font-weight:600;
                  color:#ffffff;
                ">
                  Welcome${name ? " " + name : ""} 👋
                </h1>
        
                <p style="
                  font-size:14px;
                  line-height:1.6;
                  margin:0 0 12px;
                  color:#d3d3d3;
                ">
                  Your OTP to verify your InstiLeaks account is:
                </p>
        
                <div style="
                  margin:18px 0 12px;
                  padding:14px 16px;
                  text-align:center;
                  border-radius:10px;
                  border:1px solid #6a2bed;
                  background-color:#121218;
                  font-size:24px;
                  letter-spacing:6px;
                  font-weight:700;
                  color:#ffdf6b;
                ">
                  ${otp}
                </div>
        
                <p style="
                  font-size:14px;
                  line-height:1.6;
                  margin:0 0 14px;
                  color:#d3d3d3;
                ">
                  Or tap the button below to verify your email instantly:
                </p>
        
                <div style="text-align:center; margin-bottom:14px;">
                  <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="
                    display:inline-block;
                    padding:10px 24px;
                    border-radius:999px;
                    background:#6a2bed;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                  ">
                    Verify my email
                  </a>
                </div>
        
                <div style="
                  font-size:12px;
                  color:#a0a0aa;
                  word-break:break-all;
                  margin-bottom:12px;
                ">
                  Or copy & paste this link into your browser:<br />
                  ${verifyUrl}
                </div>
        
                <p style="
                  font-size:12px;
                  color:#8d8d95;
                  margin-bottom:8px;
                ">
                  This link will expire in <span style="color:#6a2bed;font-weight:600;">60 minutes</span>.  
                  If you didn’t try to sign up, you can ignore this message.
                </p>
        
                <div style="
                  margin-top:18px;
                  font-size:11px;
                  color:#777777;
                  border-top:1px solid #25252d;
                  padding-top:10px;
                ">
                  Sent by InstiLeaks — unofficial campus chaos layer.<br />
                  Please don’t share this link with anyone.
                </div>
        
              </div>
            </div>
          </body>
        </html>
        `;
        
         let r = await sendEmail(
            `${rollNo}@iitb.ac.in`,
            "InstiLeaks - Verify your email to continue",
            html
          );    
        if(r)
            res.json({
                status:200,
                msg:'account created',
            });
        else 
            res.json({
                status:500,
                msg:'failed to send email',
            });
        
    } catch(err) {
        res.json({status:500, msg:'error at account creation'});
        console.log(err)
    }
});
authRouter.post("/loginUser", validateFields, scanIP, async(req, res) => {
    try {
        let {rollNo, password} = req.body;
        let result = await findUser({rollNo:rollNo});
        if(result.length==1 && result[0].emailVerified) {
            result = result[0];
            let isMatched = await bcrypt.compare(password, result.password);
            if(!isMatched) {
                return res.json({status:403, msg:"wrong password"});
            }
            else {
                let data = {
                    name:result.name,
                    rollNo:result.rollNo,
                    idName:result.idName?result.idName:"none",
                    gender:result.gender,
                    uId : result.uId,
                notificationSettings:result.notificationSettings,
                bio:result.bio,
                    pfpLink:result.pfpLink?result.idName:"none",
                    _id:result._id
                };
                let jwtToken = jsonwebtoken.sign({name : result.name, rollNo : result.rollNo}, jwtKey);
                return res.json({status:200, data, jwtToken:jwtToken});
            }   
        }
        else {
            res.json({status:403, msg:"Wrong password"});
        }
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:"error occured in login", err});
    }
});
authRouter.get("/verifyJWT", validateFields, scanIP, async(req, res) => {
    try {
        let dat = jsonwebtoken.verify(req.query.jwtToken, jwtKey);
        res.json({status:200});
    } catch(err) {
        res.json({status:400, err, msg:'invalid jwt'});
    }
});
authRouter.post("/userforgotPass1", validateFields, scanIP, async(req, res) => {
    try {
        let {rollNo} = req.body;
        const otp = crypto.randomInt(1000, 9999);

        let result = await sendEmail(`${rollNo}@iitb.ac.in`, `Reset Your Password`, `OTP for resetting your password is ${otp}`);
        if(result) {
            let t = new Date().getTime()%1000000;
            await redis.setEx(`forgotOtp:${rollNo}`, 300, String(otp));
            await redis.setEx(`forgotToken:${rollNo}`, 300, String(t));
            res.json({status:200, token:t});
        }
        else {
            res.json({status:500, msg:"failed to send email"});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500, err});
    }
});

authRouter.post("/userforgotPass2", validateFields, scanIP, async(req, res) => {
    try {
        let {rollNo, otp, token, password} = req.body;
        
        let redisOtp = Number(await redis.get(`forgotOtp:${rollNo}`));
        let redisToken = Number(await redis.get(`forgotToken:${rollNo}`));
        if(otp == redisOtp && redisToken == token) {
            let hashedPass = await bcrypt.hash(password, rounds);
            let result = await updateUser({rollNo:rollNo}, {password:hashedPass});
            console.log(result);
            if(result.modifiedCount==1) {
                await redis.del(`forgotOtp:${rollNo}`);
                await redis.del(`forgotToken:${rollNo}`);
                res.json({status:200, msg:'password reseted'});
            }
            else {
                console.log("this");
                res.json({status:500, msg:"failed to reset password"});
            }
        }
        else {
            res.json({status:400, msg:'wrong otp'});
        }
    } catch(err) {
        console.log(err);
        res.json({status:500, err});
    }
});


authRouter.post("/verifyUserOtp", validateFields, scanIP, async(req, res) => {
    try {
        let {otp, rollNo} = req.body;
        let redisOtp = await redis.get(`otp:${rollNo}`);
        console.log(redisOtp)
        let user = (await findUser({rollNo:rollNo}));
        if(user.length==1 && !redisOtp) {
            res.json({status:400, msg:'check email for link'});
        }
        else if(otp==redisOtp) {
            user = user[0];
            let result = await updateUser({rollNo:rollNo}, {emailVerified:true});
            await redis.del(`otp:${rollNo}`);
            await redis.del(`verifyToken:${rollNo}`);
            // let data = {
            //     name:user.name,
            //     rollNo:user.rollNo,
            //     gender:user.gender,
            //     pfpLink:user.pfpLink,
            //     idName:user.idName,
            //     uId : user.hashing_rounds
            // };
            console.log(user)
            let jwtToken = jsonwebtoken.sign({name : user.name, rollNo : rollNo}, jwtKey);
            res.json({
                status: 200, 
                data: {
                    name: user.name,
                    rollNo: user.rollNo,
                    gender: user.gender, 
                    pfpLink: user.pfpLink, 
                    idName: user.idName, 
                    _id:user._id,
                notificationSettings:user.notificationSettings,
                bio:user.bio,
                    uId : user.uId 
                }, 
                jwtToken
            });
        }
        else {
             res.json({status:400, err});
        }
    } catch(err) {
        res.json({status:500, err});
        console.log(err);
    }
});

authRouter.post("/resenduserEmail", validateFields, scanIP, async(req, res) => {
    try {
        let {rollNo} = req.body;
        let user = (await findUser({rollNo:rollNo}));
        if(user.length!=1) {
            return res.json({status:400, msg:'user dont exist'});
        }
        user = user[0];
        name = user.name;
        await redis.setEx(`verifyToken:${rollNo}`, Number((user.createdAt/100).toFixed(0)), 3600);
        const otp = crypto.randomInt(1000, 9999);

        let verifyUrl = `${process.env.frontend_link}/auth/user/verifyUserLink?token=${Number((user.createdAt/100).toFixed(0))}&otp=${otp}&rollNo=${rollNo}`;
        await redis.setEx(`otp:${rollNo}`, otp, 300);
        const html = `
        <!DOCTYPE html>
        <html>
        <body style="
            margin:0;
            padding:0;
            background-color:#0f0f10;
            font-family: Arial, sans-serif;
            color:#f5f5f5;
        ">
        
            <div style="
            max-width:480px;
            margin:0 auto;
            padding:24px 16px;
            ">
        
            <div style="
                background-color:#16161a;
                border-radius:16px;
                border:1px solid #2b2b33;
                padding:24px 20px;
            ">
        
                <div style="
                text-align:center;
                font-size:24px;
                font-weight:800;
                margin-bottom:6px;
                color:#f5f5f5;
                ">
                insti<span style="color:#6a2bed;">Leaks</span>
                </div>
        
                <div style="
                text-align:center;
                font-size:12px;
                color:#aaaaaa;
                margin-bottom:20px;
                ">
                Verify your email to unlock the real insti feed.
                </div>
        
                <h1 style="
                margin:0 0 12px;
                font-size:20px;
                font-weight:600;
                color:#ffffff;
                ">
                Welcome${name ? " " + name : ""} 👋
                </h1>
        
                <p style="
                font-size:14px;
                line-height:1.6;
                margin:0 0 14px;
                color:#d3d3d3;
                ">
                Or tap the button below to verify your email instantly:
                </p>
        
                <div style="text-align:center; margin-bottom:14px;">
                <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="
                    display:inline-block;
                    padding:10px 24px;
                    border-radius:999px;
                    background:#6a2bed;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                ">
                    Verify my email
                </a>
                </div>
        
                <div style="
                font-size:12px;
                color:#a0a0aa;
                word-break:break-all;
                margin-bottom:12px;
                ">
                Or copy & paste this link into your browser:<br />
                ${verifyUrl}
                </div>
        
                <p style="
                font-size:12px;
                color:#8d8d95;
                margin-bottom:8px;
                ">
                This link will expire in <span style="color:#6a2bed;font-weight:600;">60 minutes</span>.  
                If you didn’t try to sign up, you can ignore this message.
                </p>
        
                <div style="
                margin-top:18px;
                font-size:11px;
                color:#777777;
                border-top:1px solid #25252d;
                padding-top:10px;
                ">
                Sent by InstiLeaks — unofficial campus chaos layer.<br />
                Please don’t share this link with anyone.
                </div>
        
            </div>
            </div>
        </body>
        </html>
        `;
        let r = await sendEmail(
            `${rollNo}@iitb.ac.in`,
            "InstiLeaks - Verify your email to continue",
            html
        );
        if(r) {
            res.json({
                status:200,
                msg:'email sent',
            });
        }
        else 
            res.json({
                status:500,
                msg:'failed to send email',
            });
        
    } catch(err) {
        res.json({status:500, err});
    }
});

authRouter.post("/getuserDetails", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {rollNo, uId} = req.body;
        let user = (await findUser({rollNo:rollNo, uId : uId}));
        if(user.length==1) {
            user = user[0];
            let data = {
                name:user.name,
                uId:uId,
                gender:user.gender,
                pfpLink:user.pfpLink,
                bio:user.bio,
                notificationSettings:user.notificationSettings,
                rollNo:rollNo,
                _id:user._id
            };
            res.json({status:200, data});
        }
        else {
            res.json({status:403, msg:"bhak"});
        }
    } catch(err) {
        res.json({status:500, err});
    }
});

authRouter.get("/verifyUserLink", validateFields, scanIP, checkExistingUsers,async(req, res) => {
    try {
        let {rollNo, token, otp} = req.query;
        let redisOtp = await redis.get(`otp:${rollNo}`);
        let redisToken = await redis.get(`verifyToken:${rollNo}`);

        if(redisOtp == otp && redisToken == token) {
            let result = await updateUser({rollNo:rollNo}, {emailVerified:true});
            if(result.modifiedCount==1) {
                let user = (await findUser({rollNo:rollNo}))[0];
                let data = {
                    name:user.name,
                    uId:user.uId,
                    gender:user.gender,
                    pfpLink:user.pfpLink,
                    bio:user.bio,
                    notificationSettings:user.notificationSettings,
                };
                let jwtToken = jsonwebtoken.sign({name : user.name, rollNo : rollNo}, jwtKey);
                await redis.del(`otp:${rollNo}`);
                await redis.del(`verifyToken:${rollNo}`);
                res.json({status:200, data, jwtToken});
            }
            else {
                res.json({status:500, msg:'failed to update'});
            }
        }
        else {
            res.json({status:400, msg:'wrong link'});
        }
    } catch(err) {
        res.json({status:500, msg:"internal error", err});
    }
});

authRouter.post("/verifyUser", validateFields, checkExistingUsers, async(req, res) => {
    try {
        let {uId, _id, name} = req.body;
        let redisData = await redis.get(`verifyUser:${_id}`);
        if(redisData) {
            res.json({status:200});
            await redis.setEx(`verifyUser:${_id}`, 150, "yes");
        }
        else {
            let data = (await findUser({_id}))[0];
            if(data.uId==uId && data.name == name) {
                await redis.setEx(`verifyUser:${_id}`, 150, "yes");
                res.json({status:200});
            }
            else {
                res.json({stauts:400});
            }
        }
    } catch(err) {
        res.json({status:400, msg:"err at /verifyUser"});
        console.log(err);
    }
});


module.exports = {authRouter};
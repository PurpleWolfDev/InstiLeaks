const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8081;
const path = require("path");
app.use(express.json({ limit: "200mb" }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

cloudinary.config({ 
  cloud_name: process.env.cloudinary_cloud_name, 
  api_key: process.env.cloudinary_api_key, 
  api_secret: process.env.cloudinary_api_secret
});

async function verifyUser() {
    return true;
}

app.post("/user/attachmentUpload", async(req, res) => {
    try {
        let status = await verifyUser();
        if(status) {
            let {attachments,  ...d} = req.body;
            console.log(d);
            if(attachments.length<=3) {
                let links = await fileUpload(attachments);
                let data = {links, ...d};
                let result = await axios.post(process.env.main_api+"/home/user/addPost", data);
                // console.log(result).data;
                if(result.data.status==200) {
                    res.json({status:200, msg:'files uploaded'});
                }
            } else {
                res.json({status:400, msg:'failed to auth at file upload'});
            }
        }
        else {
            res.json({status:400, msg:'failed to auth at file upload'});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500, msg:err});
    }
});
app.post("/user/attachmentUpload_v2", async(req, res) => {
    try {
        let status = await verifyUser();
        if(status) {
            let {attachments,  ...d} = req.body;
            console.log(d);
            let links = await fileUpload([attachments]);
            let data = {pfpLink : links[0], ...d};
            let result = await axios.post(process.env.main_api+"/home/user/updatePfp", data);
            // console.log(result).data;
            if(result.data.status==200) {
                res.json({status:200, data:result.data});
            }
        }
        else {
            res.json({status:400, msg:'failed to auth at file upload'});
        }
    } catch(err) {
        console.log(err)
        res.json({status:500, msg:err});
    }
});

async function fileUpload(base64Arr) {
    try {
        let links = [];
        let promiseArr = []
        for(let i = 0;i<base64Arr.length;i++) {
            promiseArr[i] = cloudinary.uploader.upload(base64Arr[i].base64String, {
                resource_type: "auto",
            });
            console.log(promiseArr[i]);
        }
        let result = await Promise.all(promiseArr);
        console.log(result);
        for(let i = 0;i<base64Arr.length;i++) {

            links[i] = {
                public_id:result[i].public_id,
                width:result[i].width,
                height:result[i].height,
                created_at:result[i].created_at,
                secure_url:result[i].secure_url,
                size : result[i].bytes
            };
        }
        return links;
    } catch(err) {
        console.log(err)
        throw "upload failed";
    }
}

app.listen(PORT, () => console.log("server started"));
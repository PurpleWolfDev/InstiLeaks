require("dotenv").config({
    path:__dirname+"./../.env"
});
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose")
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const {sendEmail} = require("../services/sendEmail.js");
const postRoutes = express.Router();
const {saveUser, findUser, updateUser, getPosts, findPost, updatePost, addPost, addReport, addNotifs, findNotifs, deletePost, updateNotifs} = require("../services/dbFuncs.js");
const {validateFields, scanIP, checkExistingUsers, verifyJWT, scanIPv2} = require("../middlewares/middleware.js");
const jwtKey = process.env.jwt_key;
const rounds = Number(process.env.hashing_rounds);
const post_cache_limit = process.env.post_cache_limit;
const {redis} = require("../services/redis.js");

// (async() => {
//     console.log(await redis.setEx('postLikes:645192837', 1200, String([1765075709759,1765075710759,1765075711759,1765075712759,1765075713759,1765075714759,1765075715759,1765075716759,1765075717759,1765075718759, 1765075709759,1765075710759,1765075711759,1765075712759,1765075713759,1765075714759,1765075715759,1765075716759,1765075717759,1765075718759, 1765075709759,1765075710759,1765075711759,1765075712759,1765075713759,1765075714759,1765075715759,1765075716759,1765075717759,1765075718759])));
//         console.log(await redis.setEx('postLikes:829374561', 1200, String([1765075709759,1765075710759,1765075711759,1765075712759,1765075713759,1765075714759,1765075715759,1765075716759,1765075717759,1765075718759,1765075709759,1765075710759,1765075711759,1765075712759,1765075713759,1765075714759,1765075715759,1765075716759,1765075717759,1765075718759])))
// })();

postRoutes.post("/getPosts",validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {start, end, type, uId} = req.body;
        let postCount = Number(await redis.get("postHashCount"));

        // if((start<=postCount)) {
        if(false){
            const data = await redis.lRange("recentPostsGeneral", 0, -1);
            const posts = data.map(p => JSON.parse(p));
            res.json({status:200, posts});
            console.log("this case is executed", start, end, postCount);
        }
        else {
            const posts = (await getPosts(start, end, {postType:type})).map(post => post.toObject());

            for(let i = 0;i<posts.length;i++) {
                // yaha pe polls ka data hide karre h
                if(posts[i].postType=='confession' && posts[i].postStatus=="private") {
                    posts[i].postedBy = {
                        name:' Anonymous',
                        pfpLink : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYwil_5qdiU4TN2v9rRra8M_HSwncYn6XRQ&s'
                    }
                }
                if(posts[i].postType=="polls") {
                    let selectedOpt = -1;
                    for(let j = 0;j<posts[i].poll.options.length;j++) {
                        console.log(uId, posts[i].poll.options[j].votes);
                        if(selectedOpt==-1) {
                            if(posts[i].poll.options[j].votes.includes(uId)) selectedOpt = j;
                        }
                        // selectedOpt = ((selectedOpt==-1)&&posts[i].poll.options[j].votes.includes(uId))?j:-1;
                        posts[i].poll.options[j].votes = posts[i].poll.options[j].votes.length;
                    }
                    posts[i].poll.selectedOption = selectedOpt;
                }
                // -----------------------polls--------------
                if(posts[i].likedBy&&posts[i].likedBy.includes(uId)) posts[i].isLiked = true;
                else posts[i].isLiked = false;
                if(posts[i].dislikedBy&&posts[i].dislikedBy.includes(uId)) posts[i].isDisliked = true;
                else posts[i].isDisliked = false;
                posts[i].likedBy = null;
                posts[i].dislikedBy = null;
                console.log(posts[i].isLiked)
                posts[i].comments = null;
            }
            
            res.json({status:200, posts});
            console.log("else here")
        }
    } catch(err) {
        console.log('getPosts', err);
        res.json({status:500, msg:'error at get posts'});
    }
});

postRoutes.get("/getLastLikes", validateFields, verifyJWT, async(req, res) => {
    try {
        let {postId} = req.query;
        let resp = await redis.get(`postLikes:${postId}`);
        let count = 0;
        console.log(resp)
        if(resp) {
            resp = resp.split(",");
            count = resp.length;
        }
        res.json({status:200, data:count});
    } catch(err) {
        res.json({status:500, data:0});
    }
});

postRoutes.post("/addReaction", validateFields, scanIP, verifyJWT, async(req, res) => {
    try{
        let {postId, uId, task} = req.body;
        let init = 0;
        let post = (await findPost({postId:postId}))[0];
        let likedStatus = post.likedBy.includes(uId);
        let dislikedStatus = post.dislikedBy.includes(uId);
        let result;
        console.log(likedStatus, dislikedStatus)
        if(likedStatus && !dislikedStatus) {
            let index = post.likedBy.indexOf(uId);
            let arr1 = post.likedBy;
            let arr2 = post.dislikedBy;
            let count1 = post.likesCount - 1;
            let count2 = post.dislikesCount;
            arr1.splice(index, 1);
            if(task=="downvote") {
                arr2.push(uId);
                count2++;
            }
            result = (await updatePost({postId:postId}, {likedBy:arr1, dislikedBy:arr2, likesCount:count1, dislikesCount:count2}));
        }
        else if(dislikedStatus && !likedStatus) {
            let index = post.dislikedBy.indexOf(uId);
            let arr1 = post.likedBy;
            let arr2 = post.dislikedBy;
            let count1 = post.likesCount;
            let count2 = post.dislikesCount - 1;
            arr2.splice(index, 1);
            if(task=="upvote") {
                arr1.push(uId);
                count1++;
            }
            result = (await updatePost({postId:postId}, {likedBy:arr1, dislikedBy:arr2, likesCount:count1, dislikesCount:count2}));
        }
        else {
            let arr1 = post.likedBy;
            let arr2 = post.dislikedBy;
            let count1 = post.likesCount;
            let count2 = post.dislikesCount;
            if(task=="upvote") {
                arr1.push(uId);
                count1++;
            }
            else {arr2.push(uId);count2++;}
            result = (await updatePost({postId:postId}, {likedBy:arr1, dislikedBy:arr2, likesCount:count1, dislikesCount:count2}));        
        }
        if(result.modifiedCount==1)
            res.json({status:200,msg:'voted'});
        else 
            res.json({status:500, msg:'failed to vote'})
    } catch(err) {
        res.json({status:500, msg:'failed to react'});
        console.log(err)
    }
});


postRoutes.post("/addReactionPoll", validateFields, scanIP, verifyJWT, async(req, res) => {
    try{
        //0 = first option
        let {postId, uId, optionNo} = req.body;
        let init = 0;
        let post = (await findPost({postId:postId, postType:'polls'}))[0];
        let maxOpt = post.poll.options.length;
        let optNo = -1;
        for(let i = 0;i<maxOpt;i++) {
            if(post.poll.options[i].votes.includes(uId)) {
                optNo = i;
                break;
            }
        }
        let poll = post.poll;
        if(optNo==-1) {
            poll.options[optionNo].votes.push(uId);
            poll.totalVotes += 1;
        }
        else if(optNo == optionNo) {
            let index = poll.options[optNo].votes.indexOf(uId);
            poll.options[optNo].votes.splice(index, 1);
            poll.totalVotes -= 1;
        }
        else {
            let index = poll.options[optNo].votes.indexOf(uId);
            poll.options[optNo].votes.splice(index, 1);
            poll.options[optionNo].votes.push(uId);
        }
        let result = (await updatePost({postId:postId}, {poll:poll}));
        if(result.modifiedCount == 1) {
            res.json({status:200, msg:'response saved'});
        }
        else throw "err";
        } catch(err) {
        res.json({status:500, msg:'failed to react'});
        console.log(err)
    }
});


postRoutes.post("/addPost",  validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let d = new Date().getTime();
        let {uId, title, links, publicVisibility, options, jwtToken, postType, _id} = req.body;
        console.log(req.body)
        let postId = crypto.randomInt(100000000, 999999999);
        // let _id = (await findUser({uId : uId}))[0]._id;
        let data = {};
        let op = [];
        for(let i = 0;i<options.length;i++) {
            op.push({text:options[i], votes:[]});
        }
        if(postType=="polls") {
            data = {
                postId:postId,
                postedBy : _id,
                title:null,
                postType:"polls",
                postStatus:"public",
                poll:{
                    question:title,
                    options:op,
                    totalVotes:0
                },
                createdAt:d,
            }
        }
        else {
            data = {
                postId:postId,
                postedBy : _id,
                title:title,
                attachments:links,
                postType:postType,
                postStatus:publicVisibility,
                createdAt:d,
                poll:null
            }
        }
        console.log(data);
        let resp = await addPost(data);
        res.json({status:200, msg:'success'});
        let notifMsg;
        if(postType=="general") notifMsg = "Your post is live 🚀";
        else if(postType=="polls") notifMsg = "Poll is live 📊";
        else if(postType=="meme") notifMsg = "Meme deployed 😈";
        else notifMsg = "Confession posted 🤐";
        let notifsResp = await addNotifs({
            notifId : crypto.randomInt(1000000, 9999999),
            notifFor:[_id],
            notifFrom : [_id],
            notifTime: new Date().getTime(),
            notifTitle:notifMsg,
            notifMsg:"",
            notifSeenBy:[]
        }, uId, "/profile");
        if(!(notifsResp.notifTime>100000)) console.log("Error while saving notifs at /postPost");
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:'internal err'})
    }
});


postRoutes.post("/postComment", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {uId, postId, commentText, _id} = req.body;
        let data = {
            commentText:commentText,
            commentedBy: _id,
            commentedAt:new Date().getTime()
        };
        console.log("---------id------------")
        console.log(_id);
        const update = {
            $push: { comments: data },
            $inc: { commentsCount: 1 }
        };
        let resp = (await updatePost({postId:postId}, update));
        if(resp.modifiedCount==1) {
            res.json({status:200, msg:'success'});
        }
        else {
            res.json({status:500, msg:'else err'});
            console.log(resp);
        }
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:'err at comments posting'});
    }
});


postRoutes.get("/getComments", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {postId, page} = req.query;
        postId = Number(postId);
        console.log(postId);
        const pageSize = 20; 
        let start = (page-1)*pageSize;
        let end = start + pageSize;
        let comments = (await findPost({postId:postId}))[0].comments;
        comments = comments.reverse();
        comments = comments.slice(start, end);
        // for(let i = 0;i<comments.length;i++) {
        //     // comments[i].commentedBy = null;
        // }
        res.json({status:200, comments})
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:'err at fetching comments'});
    }
});


postRoutes.post("/report", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {_id, reportedTo, reportMsg, uId} = req.body;
        let reportId = crypto.randomInt(10000000, 99999999);
        let data = {
            reportId,
            reportedBy : _id,
            reportedTo : reportedTo,
            reportMsg:reportMsg,
            tor : new Date().getTime()
        };
        let result = (await addReport(data));
        res.json({status:200, msg:'reported'});
        let notifsResp = await addNotifs({
            notifId : crypto.randomInt(1000000, 9999999),
            notifFor:[_id],
            notifFrom : [_id],
            notifTime: new Date().getTime(),
            notifTitle:"Report submitted",
            notifMsg:"We’ve received your report and will take a look.",
            notifSeenBy:[]
        }, uId, "/profile");
        if(!(notifsResp.notifTime>100000)) console.log("Error while saving notifs at /reports");
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:'err at report'});
    }   
});

postRoutes.post("/getPost",validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {start, end, type, uId, postId} = req.body;
        let postCount = Number(await redis.get("postHashCount"));

        // if((start<=postCount)) {
        if(false){
            const data = await redis.lRange("recentPostsGeneral", start-1, end-1);
            const posts = data.map(p => JSON.parse(p));
            res.json({status:200, posts});
            console.log("this case is executed", start, end, postCount);
        }
        else {
            const posts = (await getPosts(start, end, {postType:type, postId:postId})).map(post => post.toObject());

            for(let i = 0;i<posts.length;i++) {
                // yaha pe polls ka data hide karre h
                if(posts[i].postType=='confession' && posts[i].postStatus=="private") {
                    posts[i].postedBy = {
                        name:' Anonymous',
                        pfpLink : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYwil_5qdiU4TN2v9rRra8M_HSwncYn6XRQ&s'
                    }
                }
                if(posts[i].postType=="polls") {
                    let selectedOpt = -1;
                    for(let j = 0;j<posts[i].poll.options.length;j++) {
                        console.log(uId, posts[i].poll.options[j].votes);
                        if(selectedOpt==-1) {
                            if(posts[i].poll.options[j].votes.includes(uId)) selectedOpt = j;
                        }
                        // selectedOpt = ((selectedOpt==-1)&&posts[i].poll.options[j].votes.includes(uId))?j:-1;
                        posts[i].poll.options[j].votes = posts[i].poll.options[j].votes.length;
                    }
                    posts[i].poll.selectedOption = selectedOpt;
                }
                // -----------------------polls--------------
                if(posts[i].likedBy&&posts[i].likedBy.includes(uId)) posts[i].isLiked = true;
                else posts[i].isLiked = false;
                if(posts[i].dislikedBy&&posts[i].dislikedBy.includes(uId)) posts[i].isDisliked = true;
                else posts[i].isDisliked = false;
                posts[i].likedBy = null;
                posts[i].dislikedBy = null;
                console.log(posts[i].isLiked)
                posts[i].comments = null;
            }
            let newPosts = [];
            for(let i = posts.length-1;i>=0;i--) {
                newPosts[posts.length-i-1] = posts[i];
            }
            console.log(newPosts)
            res.json({status:200, posts:newPosts});
            console.log("else here")
        }
    } catch(err) {
        console.log('getPosts', err);
        res.json({status:500, msg:'error at get posts'});
    }
});

postRoutes.get("/getNotifs", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {_id, page} = req.query;
        const pageSize = 20; 
        let start = (page-1)*pageSize;
        console.log(page, start)
        let end = start + pageSize;
        let notifs = (await findNotifs(_id));
        let unReadCount = 0;
        for(let i = 0;i<notifs.length;i++) {  
            if(notifs[i].notifSeenBy!=_id) unReadCount++;
        }
        notifs = notifs.reverse();
        notifs = notifs.slice(start, end);
        console.log(notifs);
        for(let i = 0;i<notifs.length;i++) {
            notifs[i].notifFpr = [_id];
            notifs[i].notifFrom = false;
        }
        // for(let i = 0;i<comments.length;i++) {
        //     // comments[i].commentedBy = null;
        // }
        res.json({status:200, notifs, unread:unReadCount})
    } catch(err) {
        console.log(err);
        res.json({status:500, msg:'err at fetching comments'});
    }
});


postRoutes.post("/updatePfp", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let uId = req.body.uId;
        let pfpLink = req.body.pfpLink.secure_url;
        let user = (await findUser({uId:uId}))[0];
        let result = (await updateUser({uId:uId}, {pfpLink:pfpLink}));
        if(result.modifiedCount == 1) {
            let data = {
                name:user.name,
                uId:uId,
                gender:user.gender,
                pfpLink:user.pfpLink,
                bio:user.bio,
                notificationSettings:user.notificationSettings,
                rollNo:user.rollNo,
                _id:user._id
            };
            res.json({data:data, status:200})
        }
        else {
            res.json({status:500})
        }
    } catch(err) {
        console.log(err);
        res.json({status:500});
    }
});


postRoutes.post("/getUserPost", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {_id, postType, uId} = req.body;
        const userId = new mongoose.Types.ObjectId(_id);
        const posts = (await findPost({postType:postType, postedBy:userId})).map(post => post.toObject());
        console.log(posts)

            for(let i = 0;i<posts.length;i++) {
                // yaha pe polls ka data hide karre h
                if(posts[i].postType=='confession' && posts[i].postStatus=="private") {
                    posts[i].postedBy = {
                        name:' Anonymous',
                        pfpLink : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPYwil_5qdiU4TN2v9rRra8M_HSwncYn6XRQ&s'
                    }
                }
                if(posts[i].postType=="polls") {
                    let selectedOpt = -1;
                    for(let j = 0;j<posts[i].poll.options.length;j++) {
                        console.log(uId, posts[i].poll.options[j].votes);
                        if(selectedOpt==-1) {
                            if(posts[i].poll.options[j].votes.includes(uId)) selectedOpt = j;
                        }
                        // selectedOpt = ((selectedOpt==-1)&&posts[i].poll.options[j].votes.includes(uId))?j:-1;
                        posts[i].poll.options[j].votes = posts[i].poll.options[j].votes.length;
                    }
                    posts[i].poll.selectedOption = selectedOpt;
                }
                // -----------------------polls--------------
                if(posts[i].likedBy&&posts[i].likedBy.includes(uId)) posts[i].isLiked = true;
                else posts[i].isLiked = false;
                if(posts[i].dislikedBy&&posts[i].dislikedBy.includes(uId)) posts[i].isDisliked = true;
                else posts[i].isDisliked = false;
                posts[i].likedBy = null;
                posts[i].dislikedBy = null;
                posts[i].comments = null;
            }
            posts.reverse();
            res.json({status:200, posts});
            console.log("else here")
    } catch(err) {
        res.json({status : 500});
        console.log(err);
    }
});


postRoutes.post("/deletePost", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {_id, uId, postId} = req.body;
        let userId = new mongoose.Types.ObjectId(_id);
        let result = await deletePost({postedBy:userId, postId});
        if(result.deletedCount==1) {
            res.json({status: 200});
        }
        else {res.json({status: 400});}
    } catch(err) {
        console.log(err);
        res.json({status: 500});
    }
});


postRoutes.post("/registerPush", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        const {uId, payload} = req.body;
        let result = await updateUser({uId:uId}, {notificationSettings:payload});
        if(result.modifiedCount==1) {
            res.json({status:200});
        }
        else {
            res.json({status:400})
        }
    } catch(err) {
        res.json({status:500})
        console.log(err);
    }
});


postRoutes.post("/readNotifs", validateFields, scanIP, verifyJWT, async(req, res) => {
    try {
        let {_id} = req.body;
        const userId = new mongoose.Types.ObjectId(_id);
        const result = await updateNotifs(userId);
        if(result.modifiedCount>=1) res.json({status:200});
        else res.json({status:400});
    } catch(err) {
        console.log(err);
        res.json({status:500});
    }
});


module.exports = {postRoutes};

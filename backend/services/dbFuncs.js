const mongoose = require("mongoose");
const dbUrl = process.env.db_url;
mongoose.connect(dbUrl)
.then(() => {console.log("DB CONNECTED");})
.catch(err => {console.log("failed to connect to db", err);});
const {userSchema} = require("./../schemas/userSchema.js");
const {postSchema} = require("./../schemas/postSchema.js");
const {reportSchema} = require("./../schemas/reportSchema.js")
const {notifSchema} = require("./../schemas/notifSchema.js");

const Users = new mongoose.model("insti_leaks_users", userSchema);
const Posts = new mongoose.model("insti_leaks_posts", postSchema);
const Reports = new mongoose.model("insti_leaks_reports", reportSchema);
const Notifications = new mongoose.model("insti_leaks_notifications", notifSchema);

const findUser = async(params) => {
    try {
        let res = await Users.find(params);
        return res;
    } catch(err) {
        throw err;
    }
};

const saveUser = async(obj) => {
    try {
        let res = await new Users(obj).save();
        return res;
    } catch(err) {
        throw err;
    }
}

const updateUser = async(param, updatedObj) => {
    try {
        let res = await Users.updateOne(param, updatedObj);
        return res;
    } catch(err) {
        throw err;
    }
}

const getPosts = async(start, end, params, selection=null) => {
    try {
        let res = await Posts.find(params).populate({path: 'postedBy',
    select: 'name pfpLink -_id'})
    .populate({
                path: 'comments',
                populate: {
                    path: 'commentedBy',
                    select: 'name pfpLink -_id'
                }
            })
                    .select(selection)
                  .sort({ postedAt: -1 }) 
                  .skip((((start-1)<0)?0:(start-1)))               
                  .limit(end);  
                //   console.log((((start-1)<0)?0:(start-1)), end-1); 
        return res;         
    } catch(err) {
        throw err;
    }
};

const findPost = async(params) => {
    try {
        let res = await Posts.find(params).populate({path: 'postedBy',
    select: 'name pfpLink -_id'})
    .populate({
                path: 'comments',
                populate: {
                    path: 'commentedBy',
                    select: 'name pfpLink -_id'
                }
            });
                //   console.log((((start-1)<0)?0:(start-1)), end-1); 
        return res;         
    } catch(err) {
        throw err;
    }
};
const updatePost = async(params, updatedObj) => {
    try {
        let res = await Posts.updateOne(params, updatedObj);
                //   console.log((((start-1)<0)?0:(start-1)), end-1); 
        return res;         
    } catch(err) {
        throw err;
    }
};

const addPost = async(data) => {
    try {
        let res = await new Posts(data).save();
        return res;         
    } catch(err) {
        throw err;
    }
};

const addReport = async(data) => {
    try {
        let res = await new Reports(data).save();
        return res;         
    } catch(err) {
        throw err;
    }
}

const addNotifs = async(data) => {
    try {
        let res = await new Notifications(data).save();
        return res;
    } catch(err) {
        throw err;
    }
};
// const posts = [
//   // ---------- GENERAL (7) ----------
//   {
//     postId: 918273645,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Morning Walk",
//     description: "Fresh air hits different today.",
//     attachments: [
//       "https://picsum.photos/seed/g1/800/600"
//     ],
//     postType: "general",
//     postStatus: "public",
//     likesCount: 10, dislikesCount: 1, shareCount: 5,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//     commentsCount: 10,
//     poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 829374561,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Library Scenes",
//     description: "Silent but stressful.",
//     attachments: [
//       "https://picsum.photos/seed/g2/800/600",
//       "https://picsum.photos/seed/g3/800/600"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 44, dislikesCount: 66, shareCount: 2,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 736451928,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Mess Food Today",
//     description: "Unexpectedly decent.",
//     attachments: [
//       "https://picsum.photos/seed/g4/800/600",
//       "https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4",
//       "https://picsum.photos/seed/g5/800/600"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 111, dislikesCount: 45, shareCount: 22,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 645192837,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Rainy Evening",
//     description: "Campus looks unreal in rain.",
//     attachments: [
//       "https://picsum.photos/seed/g6/800/600"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 0, dislikesCount: 10, shareCount: 4,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 573819264,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Night Canteen",
//     description: "Midnight hunger unlocked.",
//     attachments: [
//       "https://picsum.photos/seed/g7/800/600",
//       "https://picsum.photos/seed/g8/800/600"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 10, dislikesCount: 10, shareCount: 1,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 492873615,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Late Study Mode",
//     description: "Coffee carrying this semester.",
//     attachments: [
//       "https://sample-videos.com/video321/mp4/480/big_buck_bunny_480p_1mb.mp4"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 430, dislikesCount:540, shareCount: 30,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 381726459,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Sunset View",
//     description: "Sky looks edited today.",
//     attachments: [
//       "https://picsum.photos/seed/g9/800/600",
//       "https://picsum.photos/seed/g10/800/600"
//     ],
//     postType: "general", postStatus: "public",
//     likesCount: 4, dislikesCount: 4, shareCount: 10,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },

//   // ---------- MEMES (5) ----------
//   {
//     postId: 729384651,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Midsem Reality",
//     description: "Confidence left the chat.",
//     attachments: ["https://picsum.photos/seed/m1/800/600"],
//     postType: "meme", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 864291735,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Deadline Mood",
//     description: "Tomorrow never comes.",
//     attachments: [
//       "https://picsum.photos/seed/m2/800/600",
//       "https://picsum.photos/seed/m3/800/600"
//     ],
//     postType: "meme", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 651927348,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "WiFi Suffering",
//     description: "5 bars, 0 speed.",
//     attachments: [
//       "https://picsum.photos/seed/m4/800/600",
//       "https://picsum.photos/seed/m5/800/600",
//       "https://picsum.photos/seed/m6/800/600"
//     ],
//     postType: "meme", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 584637291,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Group Project Truth",
//     description: "One works, five review.",
//     attachments: ["https://picsum.photos/seed/m7/800/600"],
//     postType: "meme", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 493726185,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Mess Expectations",
//     description: "Instagram vs reality.",
//     attachments: [
//       "https://picsum.photos/seed/m8/800/600",
//       "https://picsum.photos/seed/m9/800/600"
//     ],
//     postType: "meme", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,
//  poll: null,
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },

//   // ---------- POLLS (3) ----------
//   {
//     postId: 739261854,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Best Late Night Snack?",
//     description: "Hostel survival poll.",
//     attachments: ["https://picsum.photos/seed/p1/800/600"],
//     postType: "poll", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,

//     poll: {
//       question: "Best Late Night Snack?",
//       options: [
//         { text: "Maggi", votes: [] },
//         { text: "Chips", votes: [] },
//         { text: "Sandwich", votes: [] }
//       ],
//       totalVotes: 0,
//       expiresAt: Date.now() + 86400000
//     },
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 658392741,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Best Study Time?",
//     description: "Productivity check.",
//     attachments: [
//       "https://picsum.photos/seed/p2/800/600",
//       "https://picsum.photos/seed/p3/800/600"
//     ],
//     postType: "poll", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//         commentsCount: 10,

//     poll: {
//       question: "When do you study best?",
//       options: [
//         { text: "Morning", votes: [] },
//         { text: "Night", votes: [] }
//       ],
//       totalVotes: 0,
//       expiresAt: Date.now() + 86400000
//     },
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   },
//   {
//     postId: 582971364,
//     postedBy: new mongoose.Types.ObjectId("6931c512781d002ad986ece0"),
//     postedAt: Date.now(),
//     title: "Best Campus Food Spot?",
//     description: "Vote your fav place.",
//     attachments: [
//       "https://picsum.photos/seed/p4/800/600",
//       "https://picsum.photos/seed/p5/800/600",
//       "https://picsum.photos/seed/p6/800/600"
//     ],
//     postType: "poll", postStatus: "public",
//     likesCount: 0, dislikesCount: 0, shareCount: 0,
//     likedBy: [], dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//     comments: [],
//     poll: {
//       question: "Best Campus Food Spot?",
//       options: [
//         { text: "Canteen", votes: [] },
//         { text: "Food Truck", votes: [] },
//         { text: "Hostel Mess", votes: [] }
//       ],
//       totalVotes: 0,
//       expiresAt: Date.now() + 86400000
//     },
//     engagementScore: 0, visibilityScore: 0,
//     aiVerified: true, isSensitive: false, isDeleted: false, isPinned: false,
//     reportedBy: [], isBanned: false, banReason: "",
//     editedAt: new Date(), createdAt: new Date(), updatedAt: new Date()
//   }
// ];


// (async() => {let res = await Posts.insertMany(posts);console.log(res)})();
// (async() => {console.log(await Posts.deleteMany())})()
module.exports = {findUser, saveUser, updateUser, getPosts, findPost, updatePost, addPost, addReport, addNotifs};
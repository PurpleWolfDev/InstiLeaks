const mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
  name: String,
  idName: {type:String, default:"none"},
  rollNo: String,
  uId:Number,
  phoneNumber: {type:String, default:""},
  password: String, // hashed
  emailVerified: {type:Boolean, default:false},
  phoneVerified: {type:Boolean, default:false},
  gender:{type:String, default:""},
  isVerified: {type:Boolean, default:false},
  role: { type: String, default:'u' },//admin = a, user = u, moderator = m
  refreshTokens: [String],
  passwordChangedAt: {type:Number, default:new Date().getTime()},
  pfpLink: {type:String, default:""},
  bio: {type:String, default:"Hey there"},
  badges: [String], // will be assigned by moderator ya fir owner

  blockedUsers: [String],

  activeRating: {type:Number, default:0}, // some logic to sort the most active members
  memeRating: {type:Number, default:0},
  rumorRating: {type:Number, default:0},
  roastRating: {type:Number, default:0},
  pollsCreated: {type:Number, default:0},
  confessionsCount: {type:Number, default:0},

  posts: [{
    postId: String,
    type: String,
    createdAt: Number // new Date().getTime()
  }],

  // Food Radar
  foodRatingsGiven: {type:Number, default:0},

  // Notifications & Preferences
  notificationSettings: {
    likes: Boolean,
    comments: Boolean,
    mentions: Boolean,
    roastChallenges: Boolean
  },

  // Moderation
  isBanned: {type:Boolean, default:false},
  banReason: {type:String, default:""},

  // Timestamps
  createdAt: {type:Number, default:new Date().getTime()},
  lastLoginAt: {type:Number, default:new Date().getTime()},
});





module.exports = {userSchema};
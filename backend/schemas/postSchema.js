const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  postId : Number,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "insti_leaks_users"
  },  
  postedAt: Number,
  title: String,
  description: String,

  attachments: [Object],    // image/video URLs
  postType: {
    type: String,
    // meme, general,  poll
  },
  postStatus: {
    type: String,
    // public, private
  },

  likesCount: {type:Number, default:0},
  dislikesCount: {type:Number, default:0},
  shareCount: {type:Number, default:0},
  likedBy: [Number],
  dislikedBy: [Number],

  reactions: {
    fire: Number,
    skull: Number,
    laugh: Number,
    clown: Number,
    heart: Number
  },

  // Comments
  commentsCount:{type:Number, default:0},
  comments: [
        {
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "insti_leaks_users",
                required: true 
            },
            commentText: {
                type: String,
                required: true,
                trim: true
            },
            commentedAt: {
                type: Number,
            },
  }],

  poll: {
    question: String,
    options: [
      { text: String, votes: [Number] }
    ],
    totalVotes: Number,
    expiresAt: Number
  },


  engagementScore: Number,
  visibilityScore: Number,

  aiVerified: Boolean,
  isSensitive: Boolean,
  isDeleted: Boolean, // soft delete
  isPinned: Boolean,
  reportedBy: [Number],
  isBanned: Boolean,
  banReason: String,
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
});

module.exports = {postSchema};
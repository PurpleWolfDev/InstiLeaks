const mongoose = require("mongoose");

const notifSchema = mongoose.Schema({
    notifId:{
        type:Number,
        required:true
    },
    notifFor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "insti_leaks_users",
        required: true 
    }],
    notifFrom:{
        default:"6584f1a2b3c4d5e6f7a8b901",
        type: mongoose.Schema.Types.ObjectId,
        ref: "insti_leaks_users",
    },
    notifTime:{
        type:Number,
        default: new Date().getTime()
    },
    notifTitle:{
        type:String,
        default:""
    },
    notifMsg:{
        type:String,
        default:""
    },
    notifSeenBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "insti_leaks_users",
        required: true 
    }],
});

module.exports = {notifSchema};
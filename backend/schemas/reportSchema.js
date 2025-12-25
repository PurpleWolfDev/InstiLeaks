const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    reportId : {
        type:Number,
        required:true
    },
    reportedBy:{ // if normal user then _id
        type:String,
        default:"admin"
    },
    reportedTo:{
        type:String,
        required:true
    },
    reportMsg:String,
    tor : Number, // time of report,
});

module.exports = {reportSchema};
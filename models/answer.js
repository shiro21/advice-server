const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    type:           String,
    title:          String,
    tags:           Array,
    files:          Array,
    contents:       String,
    owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    enroll:        { type: mongoose.Schema.Types.ObjectId, ref: "Enroll" },
});

module.exports = mongoose.model('Answer', answerSchema);
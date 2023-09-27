const mongoose = require('mongoose');

const notifySchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    // type: 팔로우의 새글, 내 글의 답변, 내 글의 댓글 | owner: 알림을 만든사람 | guest: 알림을 받을사람
    read:           { type: Boolean, default: false },
    type:           String,
    owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article:        { type: mongoose.Schema.Types.ObjectId, ref: "Enroll" }
});

module.exports = mongoose.model('Notify', notifySchema);
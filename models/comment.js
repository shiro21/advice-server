const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    // article: 작품이름, owner: 글쓴이, articleOwner: 작품주인
    article:       { type: mongoose.Schema.Types.ObjectId, ref: "Enroll" },
    articleOwner:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    owner:         { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment:       String
});

module.exports = mongoose.model('Comment', commentSchema);
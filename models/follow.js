const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    // owner: 나 || articleOwner: 내가 팔로우 한 사람 (이름 잘못 지음...)
    owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    articleOwner:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('Follow', followSchema);
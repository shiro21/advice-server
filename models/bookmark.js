const mongoose = require('mongoose');

const bookmarkSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article:        { type: mongoose.Schema.Types.ObjectId, ref: "Enroll" },
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
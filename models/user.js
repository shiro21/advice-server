const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },

    id:             String,
    email:          String,
    gender:         String,
    nick:           String
});

module.exports = mongoose.model('User', userSchema);
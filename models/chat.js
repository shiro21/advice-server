const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },

    name:           String,
    message:        String
});

module.exports = mongoose.model('Chat', chatSchema);
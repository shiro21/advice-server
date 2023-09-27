const mongoose = require('mongoose');

const enrollSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    type:           String,
    title:          String,
    tags:           Array,
    files:          Array,
    contents:       String,
    owner:          { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Enroll', enrollSchema);
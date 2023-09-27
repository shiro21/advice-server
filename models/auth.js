const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    owner:          mongoose.Schema.Types.ObjectId,
    passport:       String,
    salt:           String
});

module.exports = mongoose.model('Auth', authSchema);
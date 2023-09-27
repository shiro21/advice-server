const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },
    
    type:           String,
    tag:            String,
    count:          { type: Number, default: 1 }
});

module.exports = mongoose.model('Tag', tagSchema);
const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    createdAt:      Date,
    updatedAt:      Date,
    isDeleted:      { type: Boolean, default: false },

    test:           String,
    files:          Array
});

module.exports = mongoose.model('Test', testSchema);
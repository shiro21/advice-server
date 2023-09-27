const express = require('express');
const app = express();

app.use('/test', require('../controllers/testController'));
app.use('/user', require('../controllers/userController'));
app.use('/enroll', require('../controllers/enrollController'));
app.use('/comment', require('../controllers/commentController'));
app.use('/tag', require('../controllers/tagController'));
app.use('/total', require('../controllers/totalController'));

module.exports = app;
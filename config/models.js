// Model
const Test = require('../models/test');
const User = require('../models/user');
const Auth = require('../models/auth');
const Enroll = require('../models/enroll');
const Comment = require('../models/comment');
const Answer = require('../models/answer');
const Tag = require('../models/tag');
const Bookmark = require('../models/bookmark');
const Follow = require('../models/follow');
const Notify = require('../models/notify');
const Chat = require('../models/chat');

module.exports = {
    Test: Test,
    User: User,
    Auth: Auth,
    Enroll: Enroll,
    Comment: Comment,
    Answer: Answer,
    Tag: Tag,
    Bookmark: Bookmark,
    Follow: Follow,
    Notify: Notify,
    Chat: Chat
}
const plugins = require('../config/plugins');
const router = plugins.express.Router();
const models = require('../config/models');

router.post('/bookmark', async (req, res) => {

    const item = req.body;
    let user = {};

    await models.User.findOne(item)
    .then(_user => {
        user = _user;
    })
    .catch(err => console.log('user err', err));

    await models.Bookmark.find({owner: item._id, isDeleted: false})
    .populate('article')
    .populate('owner')
    .then(bookmark => {
        res.status(200).json({
            code: 'y',
            data: bookmark,
            user: user
        });
    })
    .catch(err => console.log('bookmark err', err));
});

router.post('/mywrite', async (req, res) => {

    const item = req.body;
    let user = {};
    let enroll = {};

    await models.User.findOne(item)
    .then(_user => {
        user = _user;
    })
    .catch(err => console.log('user err', err));

    await models.Enroll.find({owner: item._id, isDeleted: false})
    .populate('owner')
    .then(_enroll => {
        enroll = _enroll;
    })
    .catch(err => console.log('enroll err', err));

    await models.Answer.find({owner: item._id, isDeleted: false})
    .populate('enroll')
    .populate('owner')
    .then(answer => {
        res.status(200).json({
            code: 'y',
            enroll: enroll,
            answer: answer,
            user: user
        });
    })
    .catch(err => console.log('answer err', err));

});

module.exports = router;
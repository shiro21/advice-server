const plugins = require('../config/plugins');
const router = plugins.express.Router();
const models = require('../config/models');


router.post('/create', (req, res) => {

    const item = req.body;

    const comment = new models.Comment({
        _id: new plugins.mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),

        article: item.article,
        articleOwner: item.articleOwner,
        owner: item.owner,
        comment: item.comment
    });

    comment.save()
    .then(result => {
        models.Comment.find({article: result.article, isDeleted: false})
        .populate('articleOwner')
        .populate('owner')
        .then(result => {
            res.status(200).json({
                code: 'y',
                comment: result
            });
            
            const notify = new models.Notify({
                _id: new plugins.mongoose.Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),

                type: 'comment',
                owner: item.owner,
                guest: item.articleOwner,
                article: item.article
            });

            notify.save();

        })
        .catch(err => console.log('comment err', err));
    })
    .catch(err => console.log('comment err', err));
});

router.post('/delete', async(req, res) => {
    
    const item = req.body;

    await models.Comment.findOne(item)
    .then(_comment => {
        _comment.updatedAt = new Date();
        _comment.isDeleted = true;

        _comment.save()
        .then(comment => {
            models.Comment.find({article: item.article, isDeleted: false})
            .populate('owner')
            .populate('articleOwner')
            .then(result => {
                res.status(200).json({
                    code: 'y',
                    comment: result
                });
            })
            .catch(err => console.log('comment find err', err));
        })
        .catch(err => console.log('comment err', err));
    })
    .catch(err => console.log('comment delete err', err));

    // models.Comment.find({article: item.article})
    // .then(result => {
    //     res.status(200).json({
    //         code: 'y',
    //         comment: result
    //     });
    // })
    // .catch(err => console.log('comment find err', err));

});

module.exports = router;
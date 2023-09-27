const plugins = require('../config/plugins');
const router = plugins.express.Router();
const models = require('../config/models');
const firebaseApp = require('../config/firebase');
const { getDownloadURL, ref, getStorage, getMetadata } = require('firebase/storage');
const uploadService = require('../services/uploadService');
const firebaseFile = uploadService.fireMulter.array('files');
// const firebaseAnswer = uploadService.fireAnswer.array('files');

router.post('/create', (req, res) => {
    
    const storage = getStorage();

    firebaseFile(req, res, function(err) {
        
        new Promise(function(resolve, reject) {
            if (req.files.length > 0) {
                let uploads = [];
                for (let i = 0; i < req.files.length; i++) {
                    getDownloadURL(ref(storage, req.files[i].path))
                    .then(url => {
                        uploads.push(url);

                        if (req.files.length === uploads.length) {
                            resolve(uploads);
                        }
                    })
                    .catch(err => console.log('url err', err));
                }
            } else {
                resolve(null);
            }
        })
        .then(result => {
            const enroll = new models.Enroll({
                _id: new plugins.mongoose.Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),

                type: req.body.type,
                title: req.body.title,
                tags: req.body.tags,
                files: result,
                contents: req.body.contents,
                owner: req.body.owner
            });

            enroll.save()
            .then(enroll => {
                res.status(200).json({
                    code: 'y',
                });

                models.Tag.find({type: 'req'})
                .then(result => {

                    let tags = enroll.tags;

                    let newArray = tags;

                    // 태그가 없는 경우
                    if (result.length === 0) {
                        for (let i = 0; i < tags.length; i++) {
                            const tag = new models.Tag({
                                _id: new plugins.mongoose.Types.ObjectId(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                
                                type: req.body.type,
                                tag: tags[i]
                            });
            
                            tag.save();
                        }
                    }

                    // 태그가 있는경우
                    for (let i = 0; i < result.length; i++) {
                        for (let j = 0; j < tags.length; j++) {
                            if (result[i].tag === tags[j]) {
                                result[i].updatedAt = new Date();
                                result[i].count = result[i].count + 1;

                                result[i].save();
                                newArray.splice(j, 1);
                            }
                        }
                    }

                    if (result.length !== 0 && newArray.length > 0) {
                        for (let i = 0; i < newArray.length; i++) {
                            const tag = new models.Tag({
                                _id: new plugins.mongoose.Types.ObjectId(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                
                                type: req.body.type,
                                tag: newArray[i]
                            });
            
                            tag.save();
                        }
                    }

                })
                .catch(err => console.log('tag err' , err));

                models.Follow.find({articleOwner: enroll.owner, isDeleted: false})
                .then(follow => {
                    for (let i = 0; i < follow.length; i++) {
                        const notify = new models.Notify({
                            _id: new plugins.mongoose.Types.ObjectId(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
        
                            type: 'article',
                            owner: follow[i].articleOwner,
                            guest: follow[i].owner,
                            article: enroll._id
                        });
    
                        notify.save();
                    }
                })
                .catch(err => console.log('follow err', err));
            })
            .catch(err => console.log('enroll Error', err));
        })
        .catch(err => console.log('enroll Error', err));
    })
});

router.post('/answerCreate', (req, res) => {

    const storage = getStorage();

    firebaseFile(req, res, function(err) {
        
        new Promise(function(resolve, reject) {
            if (req.files.length > 0) {
                let uploads = [];
                for (let i = 0; i < req.files.length; i++) {
                    getDownloadURL(ref(storage, req.files[i].path))
                    .then(url => {
                        uploads.push(url);

                        if (req.files.length === uploads.length) {
                            resolve(uploads);
                        }
                    })
                    .catch(err => console.log('url err', err));
                }
            } else {
                resolve(null);
            }
        })
        .then(result => {
            const answer = new models.Answer({
                _id: new plugins.mongoose.Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),

                type: req.body.type,
                title: req.body.title,
                tags: req.body.tags,
                files: result,
                contents: req.body.contents,
                owner: req.body.owner,
                enroll: req.body.enroll
            });

            answer.save()
            .then(enroll => {
                res.status(200).json({
                    code: 'y',
                });

                let tags = enroll.tags;

                let newArray = tags;

                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < tags.length; j++) {
                        if (result[i].tag === tags[j]) {
                            result[i].updatedAt = new Date();
                            result[i].count = result[i].count + 1;

                            result[i].save();
                            newArray.splice(j, 1);
                        }
                    }
                }

                if (result.length !== 0 && newArray.length > 0) {
                    for (let i = 0; i < newArray.length; i++) {
                        const tag = new models.Tag({
                            _id: new plugins.mongoose.Types.ObjectId(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
            
                            type: req.body.type,
                            tag: newArray[i]
                        });
        
                        tag.save();
                    }
                }
                
                const notify = new models.Notify({
                    _id: new plugins.mongoose.Types.ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),

                    type: 'answer',
                    owner: enroll.owner,
                    guest: req.body.guest,
                    article: enroll.enroll
                });

                notify.save();

            })
            .catch(err => console.log('enroll Error', err));
        })
    })
});

router.post('/update', (req, res) => {

    const storage = getStorage();

    firebaseFile(req, res, function(err) {
        const item = req.body;

        new Promise(function(resolve, reject) {
            if (req.files.length > 0) {
                let uploads = [];
                for (let i = 0; i < req.files.length; i++) {
                    getDownloadURL(ref(storage, req.files[i].path))
                    .then(url => {
                        uploads.push(url);

                        if (req.files.length === uploads.length) {
                            resolve(uploads);
                        }
                    })
                    .catch(err => console.log('url err', err));
                }
            } else {
                resolve(null);
            }
        })
        .then(result => {
            // console.log(item.updateFiles.concat(result));
            let totalFiles = [];
            
            if (item.updateFiles !== undefined) {
                if (item.updateFiles.split(",").length === 1) {
                    totalFiles = [item.updateFiles, ...result];
                } else {
                    for (let i = 0; i < String(item.updateFiles.split(",").length); i++) {
                        totalFiles.push(String(item.updateFiles.split(",")[i]));
                    }
                    if (result !== null) {
                        totalFiles = [...totalFiles, ...result];
                    }
                }

            } else {
                totalFiles = [...result || []];
            }

            models.Enroll.findOne({_id: item._id})
            .populate('owner')
            .then(_article => {
                
                _article.updatedAt = new Date();

                _article.title = item.title;
                _article.tags = item.tags;
                _article.files = totalFiles;
                _article.contents = item.contents;

                _article.save()
                .then(result => {
                    res.status(200).json({
                        code: 'y'
                    });
                })
                .catch(err => console.log("article update err", err));
            })
            .catch(err => console.log("article err", err));
        })
        .catch(err => console.log('update err', err));
    })
});

router.post('/delete', (req, res) => {
    const item = req.body;

    models.Enroll.findOne({_id: item._id})
    .then(_delete => {
        _delete.updatedAt = new Date();
        _delete.isDeleted = true;

        _delete.save()
        .then(result => {
            res.status(200).json({
                code: 'y'
            });
        })
        .catch(err => console.log('enroll delete err', err));
    })
    .catch(err => console.log('delete err', err));
});

router.post('/uploadDecoded', async (req, res) => {
    const item = req.body;
    const storage = getStorage();
    let metaData = [];
    let forestRef;

    forestRef = ref(storage, item);

    for (let i = 0; i < item.length; i++) {
        forestRef = ref(storage, item[i]);

        await getMetadata(forestRef)
        .then(meta => {
            metaData.push(meta);
        })
        .catch(err => console.log("meta err", err));
    }
    
    res.status(200).json({
        code: 'y',
        data: metaData
    });
})

router.post('/find', async (req, res) => {

    let itemEnroll = {};
    let itemAnswer = {};
    let itemTag = {};

    await models.Enroll.find({isDeleted: false})
    .sort({createdAt: -1})
    .populate('owner')
    .then(result => {
        itemEnroll = result
    })
    .catch(err => console.log('enroll find err', err));

    await models.Answer.find({isDeleted: false})
    .populate('owner')
    .populate('enroll')
    .then(result => {
        itemAnswer = result;
    })
    .catch(err => console.log('enroll find err', err));

    await models.Tag.find()
    .sort({count: -1, updatedAt: -1})
    .limit(5)
    .then(result => {
        itemTag = result;
    })
    .catch(err => console.log('tag find err', err));

    res.status(200).json({
        code: 'y',
        data: itemEnroll,
        answer: itemAnswer,
        tag: itemTag
    });

});

router.post('/single', async(req, res) => {
    
    const item = req.body;

    let itemArticle = {};
    let itemComment = {};
    let itemAnswer = {};
    let itemBookmark = {};
    let itemFollow = {}

    await models.Enroll.findOne(item)
    .populate('owner')
    .then(article => {
        itemArticle = article;
    })
    .catch(err => console.log('enroll single err', err));

    await models.Comment.find({article: item._id, isDeleted: false})
    .populate('articleOwner')
    .populate('owner')
    .then(comment => {
        itemComment = comment;
    })
    .catch(err => console.log('enroll single err', err));

    await models.Answer.find({enroll: item._id, isDeleted: false})
    .populate('owner')
    .then(enroll => {
        itemAnswer = enroll;
    })
    .catch(err => console.log('enroll single err', err));

    await models.Bookmark.find({article: item._id, isDeleted: false})
    .then(bookmark => {
        itemBookmark = bookmark;
    })
    .catch(err => console.log('enroll single err', err));

    await models.Follow.find({articleOwner: itemArticle.owner._id, isDeleted: false})
    .then(follow => {
        itemFollow = follow;
    })
    .catch(err => console.log('enroll single err', err));

    res.status(200).json({
        code: 'y',
        data: itemArticle,
        comment: itemComment,
        answer: itemAnswer,
        bookmark: itemBookmark,
        follow: itemFollow
    });
});

module.exports = router;
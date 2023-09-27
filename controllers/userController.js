const plugins = require('../config/plugins');
const router = plugins.express.Router();
const models = require('../config/models');

// 유저 생성
router.post('/create', async (req, res) => {

    const item = req.body;
    let idCheck = false;

    await models.User.findOne({id: item.id})
    .then(result => {
        if (result !== null) idCheck = true;
    })
    .catch(err => console.log('join Error', err));

    if (idCheck === true) {
        return res.status(200).json({
            code: 'n',
            message: '아이디가 이미 있습니다.'
        });
    }

    const user = new models.User({
        _id:        new plugins.mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        id:         item.id,
        email:      item.email,
        gender:     item.gender,
        nick:       item.nick
    });

    user.save()
    .then(result => {
        plugins.crypto.randomBytes(64, (err, buf) => {
            plugins.crypto.pbkdf2(item.password, buf.toString('base64'), 5050, 64, 'sha512', (err, key) => {
                const auth = new models.Auth({
                    _id:        new plugins.mongoose.Types.ObjectId(),
                    createdAt:  new Date(),
                    updatedAt:  new Date(),

                    owner:      result._id,
                    passport:   key.toString('base64'),
                    salt:       buf.toString('base64')
                });

                auth.save()
                .then(result => {
                    plugins.jwt.sign({user: user}, 'secretkey', {expiresIn: '1 days'}, (err, token) => {
                        res.status(200).json({
                            code: 'y',
                            token: token,
                            user: user._id
                        })
                    })
                })
                .catch(err => console.log('auth Error', err));
            })
        })
    })
    .catch(err => console.log('user Error', err));
});

router.post('/login', async(req, res) => {

    const item = req.body;

    await models.User.findOne({id: item.id})
    .then(user => {
        if (user === null || user === undefined) {
            res.status(200).json({
                code: 'n',
                message: '아이디가 존재하지 않습니다.'
            });
        } else {
            models.Auth.findOne({owner: user._id})
            .then(auth => {
                plugins.crypto.pbkdf2(item.password, auth.salt, 5050, 64, 'sha512', (err, key) => {
                    if(key.toString('base64') === auth.passport) {
                        plugins.jwt.sign({user: user}, 'secretkey', {expiresIn: '1 days'}, (err, token) => {
                            res.status(200).json({
                                code: 'y',
                                token: token,
                                user: auth.owner
                            })
                        })
                    } else {
                        res.status(200).json({
                            code: 'n',
                            message: '비밀번호가 다릅니다.'
                        })
                    }
                })
            })
        }
    })
    .catch(err => console.log('login Error', err));



});

router.post('/single', async (req, res) => {

    const item = req.body;
    let userData = {};
    
    await models.User.findOne({_id: item.user})
    .then(user => {
        if (user === null || user === undefined) {
            res.status(200).json({
                code: 'n',
                message: '잘못된 접근입니다.'
            });
        } else {
            userData = user;
        }
    })
    .catch(err => console.log('Single Err', err));

    if (item.user) {
        await models.Notify.find({guest: item.user, isDeleted: false})
        .populate('owner')
        .sort({createdAt: -1})
        .limit(20)
        .then(notify => {
            res.status(200).json({
                code: 'y',
                data: userData,
                notify: notify
            });
        })
        .catch(err => console.log('Single Err', err));
    }
});

// 프로필 변경
router.post('/profile', (req, res) => {
    const item = req.body;

    models.User.findOne({_id: item._id})
    .then(_result => {
        _result.updatedAt = new Date();

        _result.email = item.email;
        _result.nick = item.nick;

        _result.save()
        .then(result => {
            res.status(200).json({
                code: 'y',
                data: result
            });
        })
        .catch(err => console.log('profileChange Err', err));
    })
    .catch(err => console.log('profile Err', err));
});

// 북마크 생성
router.post('/bookmark', (req, res) => {

    const item = req.body;

    const bookmark = new models.Bookmark({
        _id:        new plugins.mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        owner:      item.owner,
        article:    item.article
    });

    bookmark.save()
    .then(result => {
        res.status(200).json({
            code: 'y'
        });
    })
    .catch(err => console.log('bookmkar err', err));
});

// 북마크 해제
router.post('/bookmarkCancel', (req, res) => {
    
    const item = req.body;

    models.Bookmark.findOne(item)
    .then(_bookmark => {
        _bookmark.updatedAt = new Date();
        
        _bookmark.isDeleted = true;

        _bookmark.save()
        .then(result => {
            res.status(200).json({
                code: 'y'
            });
        })
        .catch(err => console.log('bookmark update Err', err));
    })
    .catch(err => console.log('bookmark update Err', err));
});

// 팔로우 생성
router.post('/follow', (req, res) => {

    const item = req.body;
    
    const follow = new models.Follow({
        _id:              new plugins.mongoose.Types.ObjectId(),
        createdAt:        new Date(),
        updatedAt:        new Date(),

        owner:           item.owner,
        articleOwner:    item.articleOwner
    });

    follow.save()
    .then(result => {
        res.status(200).json({
            code: 'y'
        });
    })
    .catch(err => console.log('follow err', err));
});

router.post('/followCancel', (req, res) => {

    const item = req.body;

    models.Follow.findOne(item)
    .then(_follow => {
        _follow.updatedAt = new Date();
        _follow.isDeleted = true;

        _follow.save()
        .then(result => {
            res.status(200).json({
                code: 'y'
            });
        })
        .catch(err => console.log('follow err', err));
    })
    .catch(err => console.log('follow err', err));
});

module.exports = router;
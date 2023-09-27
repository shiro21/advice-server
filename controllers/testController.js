const plugins = require('../config/plugins');
const router = plugins.express.Router();
const models = require('../config/models');
const multer  = require('multer');
const firebaseStorage = require('multer-firebase-storage');
// const upload = multer({ dest: 'uploads/' });
const conn = require('../config/conn');
const mailService = require('../services/mailService');

const firebaseApp = require('../config/firebase');
const { getDownloadURL, ref, getStorage } = require('firebase/storage');

const fireMulter = multer({
    
    // storage: firebaseStorage(conn.fireStorage)
    storage: firebaseStorage({
        bucketName: 'gs://advice-project-a11c3.appspot.com',
        credentials: {
            clientEmail: 'firebase-adminsdk-8dx6u@advice-project-a11c3.iam.gserviceaccount.com',
            privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCtjH61UyvDwAT1\np+QaCsbfiGDw46OBj4pL/CMsdkgnuK5oTGX38U/RswG4NbGNe/eR7sRSOymroCW3\neiux7U/SMjG2UYqFsK+5Zr5kJt1YENSxpYmlBH+GmzQVf/H79IIfBV6bRyuDJIms\nKjIKZA4qRf9ywPl1oKrGCYNu+n3HEgIcOFB03za+6UnZ3dLfa2K3jhRw3NrxuewV\n5G93sbb5H4ujBtWpfg1Vd2QEWmR4G9QptOV5W0R8gefncr6qLJQAlqMthcCTcXYT\nWr2ssW7Q/tSIZK45RbtbVoqXvk9exIe1EZ84TLJ2WNFIP3vzYjuH5DNVjkex2CXs\nTJaKOq7VAgMBAAECggEAAW4rORiEsD3ecbcmgGLs3zOazoh9m1B/C1G3z52e1Gvb\n+1OjyapzqcfEDMMohuJLN4UHmY2AWyjwwiiqCCEAFJiOjMWgwNz2ZDOw4RmDYbSR\n92W77yUuFeO0BIeqSNezeIZC0yvhK/KrUu3UlILnW4sn8keimeek1IPaUUgZMgrf\nsNOg+bXcFIZNapoEEWA1XxWrS76MRXx0kyU8xB65NxAn+lmESuS7bkBPE3NYlJFY\nCDSvpoRywQNzcAZTVIXuryFUk7UpI3eXsj8MqG/Q5IuLpOrOIPYScB+uL769BmEf\nK/+m64kpsLn/IsrJ0pyAXKLBSQodooZ4y66mJyRV2wKBgQDh4gh+dKlnTzImQq1D\nWcw55Znt0rCNJ2iJ4WI/p0BegavDqjtzRlar1cMYit0c9iAJkeU8cBBfUW7zF0Pc\nWGrcAlYir/bIJU5876wYfo4nrMJTQB7O/SEX4808Se6Shp5DjJyKxbmtQ1gTcfNK\nHwJJ4A3wnUJ7KAsZMzLk9gIXewKBgQDEsCm2/taKhZd88ort3HOIlwgmvoOA4CUW\ncsesCb+Wdz0HoVWC+KoMF1wA+D3vcOtYaeBuMsX8Awq0TRFb/O1/twnmOtFZXlRu\n4P6bt5sAv/L4yHjnfPXXSm+YCebEV+K5DZxj1xQ52crhbTroSDADA1bmYyetVTVK\nQ4Bak0dZ7wKBgQCWtwqT1aNymxULElIpLjFmMByU4o+Kn1DRLuEvN5lrdXn2BA/G\nypfp76dNKNqACHk36XDa8qr57ovpBwzwaM5kHer7Gg2/XaURF5nsfgS71DmU8qOb\n2KnMFuNJ5sqYWdofmCKbNXK+eMC7uLxsKGSOhkDG2ycQpZdCKTc8LikXIQKBgQCw\nXf6p1s1uHOh/48TsETeQDU4D3+VvVI4tGPMusvcW5wjUpLhW3r8sZG3deLugzzJZ\nb2cNqX2awueAUXL1d1FHqku4JJnAdzNi0WG9I+BbxcMLjkfL22Nej6KNRKOm/9+P\nbEMFy8CZN1AS361oyAI1UXNE1zim1rcYRnr7vQDIBQKBgQCw+xiLTXOv/rY3oZNz\noTkDx7mJ2BANnPrHgXFH9eHVMReAGpKNO4jWglYj23SVd0fehw/5xE424xSFTwNP\nzGMDOnSq49ywwjm2hlYEAgnYkMeY9TguK6g/h8EwVwSW6uQSGgpZocYsn+/QX04P\nd2jvuLrnwYDVGLcgNsD/aMImnQ==\n-----END PRIVATE KEY-----\n',
            projectId: 'advice-project-a11c3'
        },
        directoryPath: 'article',
        unique: true
    }),
})

router.get('/test', (req, res) => {
    // 로드할때 이걸로 불러서 주소 넣어주기
    // create에서 이걸로 주소 넣기 ?
    console.log('잘 들어옴');

    const storage = firebaseApp.fireStorage;
    const test = firebaseApp.storage.ref(storage, 'article/');
    // firebaseApp.storage.listAll(test)
    // .then((result) => {

    //     result.items.forEach((item) => {
    //         firebaseApp.storage.getDownloadURL(item).then((url) => {
    //             console.log(url);
    //             res.send(result.items)
    //         })
    //     })
    // })
    // .catch(err => console.log('res err', err));
});

router.post('/create', fireMulter.array('multipartFiles'), (req, res, next) => {
    const item = req.body;
    const files = req.files;
    let urls = [];
    const storage = getStorage();
    for (let i = 0; i < files.length; i++) {
        getDownloadURL(ref(storage, files[i].path))
        .then((url) => {
            urls.push(url);

            if (files.length === urls.length) {

                res.status(200).json({
                    code: "y",
                    data: url
                })
            }

            // if (files.length === urls.length) {
            //     const testCreate = new models.Test({
            //         _id: new plugins.mongoose.Types.ObjectId(),
            //         createdAt: new Date(),
            //         updatedAt: new Date(),
            
            //         test: item.test,
            //         files: urls
            //     });
            
            //     testCreate.save()
            //     .then(result => {
            //         res.status(200).json({
            //             code: 'y'
            //         });
            //     })
            //     .catch(err => console.log('TEST ERR', err));
            // }
        })
        .catch(err => console.log('url err', err));
    }
});

router.post('/find', (req, res) => {

    models.Test.find()
    .then(result => {
        res.status(200).json({
            code: 'y',
            data: result
        });
    })
    .catch(err => console.log('find Err', err));
});

router.post('/socketFind', (req, res) => {

    models.Chat.find()
    .then(result => {
        res.status(200).json({
            code: 'y',
            data: result
        });
    })
    .catch(err => console.log('socket err', err));
});

router.post('/tt', async (req, res) => {

    const email = {
        host: "smtp.naver.com",
        service: 'naver',
        auth: {
            user: "nojinsang2@naver.com",
            pass: "wnsgur123"
        }
    };
    const mailOptions = {
        from: 'nojinsang2@naver.com',
        to: 'nojinsang2@naver.com',
        subject: '텍스트',
        html: '노드JS'
    };

    let transport = plugins.nodemailer.createTransport(email);

    transport.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info.response);
    })
})

module.exports = router;

require("dotenv").config();

const multer  = require('multer');
const firebaseStorage = require('multer-firebase-storage');

const fireMulter = multer({
  storage: firebaseStorage({
      bucketName: process.env.FIREBASE_BUCKET,
      credentials: {
          clientEmail: process.env.FIREBASE_CEMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          projectId: process.env.FIREBASE_PROJECT_ID
      },
      directoryPath: 'article',
      unique: true
  }),
});

const uploads = () => {
  // const storage = getStorage();
  console.log('upload 들어옴');

}

module.exports = {
  uploads: uploads,
  fireMulter: fireMulter
}
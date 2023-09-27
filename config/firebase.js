// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getAuth } from "firebase/auth"
// import { getStorage, ref as storageRef } from "firebase/storage";
// import conn from "./conn";


// const fireApp = initializeApp(conn.firebase);

// // const fireAuth = getAuth(fireApp);
// // const fireAnalytics = getAnalytics(fireAuth);
// const storage = getStorage(fireApp);

// export { fireApp, storage, storageRef }

const firebase = require('firebase/app');
const storage = require('firebase/storage');
const conn = require('./conn');

const fireApp = firebase.initializeApp(conn.firebase);
const fireStorage = storage.getStorage(fireApp);

module.exports = {
    fireApp: fireApp,
    fireStorage: fireStorage,
    storage: storage
}
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import dotenv from 'dotenv';

dotenv.config();

// decode firebase service account from .env file
const serviceAccount = JSON.parse(
    process.env.SHAREUP_FIREBASE_CREDENTIALS || '{}'
);

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: process.env.SHAREUP_FIREBASE_API_KEY,
    authDomain: process.env.SHAREUP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.SHAREUP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.SHAREUP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.SHAREUP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.SHAREUP_FIREBASE_APP_ID,
    measurementId: process.env.SHAREUP_FIREBASE_MEASUREMENT_ID,
};

admin.initializeApp(firebaseConfig);

// fireORM
const firestore = admin.firestore();
fireorm.initialize(firestore);

export default admin;

export { firestore };

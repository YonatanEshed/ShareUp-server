import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import dotenv from 'dotenv';

dotenv.config();

// decode firebase service account from .env file
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS || '{}');

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

admin.initializeApp(firebaseConfig);

// fireORM
const firestore = admin.firestore();
fireorm.initialize(firestore);

export default admin;

export { firestore };

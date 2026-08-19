import admin from 'firebase-admin';
import logger from '../utils/logger.js';

let firebaseApp = null;

export function initializeFirebase() {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      logger.warn('Firebase credentials not configured. Auth will be disabled.');
      return null;
    }

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('Firebase initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('Firebase initialization failed:', error.message);
    return null;
  }
}

export function getFirebaseAuth() {
  return firebaseApp ? admin.auth() : null;
}

export default { initializeFirebase, getFirebaseAuth };

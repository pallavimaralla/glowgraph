import { getFirebaseAuth } from '../config/firebase.js';
import { upsertUserFromFirebase } from '../services/auth.service.js';
import logger from '../utils/logger.js';

export async function authMiddleware(req, res, next) {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    return res.status(401).json({ error: 'Firebase auth not configured' });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // Upsert user to database
    const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);
    await upsertUserFromFirebase(firebaseUser);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    return next();
  }

  const token = req.headers.authorization?.split('Bearer ')[1];

  if (token) {
    firebaseAuth
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
        };
        next();
      })
      .catch((error) => {
        logger.warn('Optional token verification failed:', error.message);
        next();
      });
  } else {
    next();
  }
}

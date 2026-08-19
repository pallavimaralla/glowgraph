import User from '../models/User.js';
import logger from '../utils/logger.js';

export async function upsertUserFromFirebase(firebaseUser) {
  try {
    let user = await User.findOne({ uid: firebaseUser.uid });

    if (!user) {
      // Create new user
      user = new User({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoUrl: firebaseUser.photoURL || '',
        lastLogin: new Date(),
      });
      await user.save();
      logger.info(`Created new user: ${firebaseUser.email}`);
    } else {
      // Update existing user
      user.updateFromAuth(firebaseUser);
      await user.save();
      logger.info(`Updated user: ${firebaseUser.email}`);
    }

    return user;
  } catch (error) {
    logger.error('Upsert user error:', error.message);
    throw error;
  }
}

export async function getUserProfile(uid) {
  try {
    const user = await User.findOne({ uid });
    return user;
  } catch (error) {
    logger.error('Get user profile error:', error.message);
    throw error;
  }
}

export async function updateUserProfile(uid, updates) {
  try {
    const user = await User.findOneAndUpdate({ uid }, updates, { new: true });
    return user;
  } catch (error) {
    logger.error('Update user profile error:', error.message);
    throw error;
  }
}

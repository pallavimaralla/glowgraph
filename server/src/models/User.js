import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    displayName: String,
    photoUrl: String,
    phone: String,
    defaultAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      skinType: String,
      skinConcerns: [String],
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.methods.updateFromAuth = function (firebaseUser) {
  this.email = firebaseUser.email;
  this.displayName = firebaseUser.displayName || this.displayName;
  this.photoUrl = firebaseUser.photoURL || this.photoUrl;
  this.lastLogin = new Date();
  return this;
};

export default mongoose.model('User', userSchema);

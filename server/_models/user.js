const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 3,
    LOCK_TIME = 2 * 60 * 60 * 1000;



const UserSchema = new Schema({
    first_name:String,
    last_name:String,
    user_name:{ type:String,unique:true},
    user_password:String,
    address:{
      street_address: String,
      locality: String,
      administrative_area_level_1: String,
      postal_code: String,
      country: String,
      lng:{type: Number,default: -79.55672809999999 },
      lat:{type: Number, default: 43.6951755 }
    },
    nfAddress:{
      address: {type:String},
      storeID:{type: Number},
      lng:{type: Number},
      lat:{type: Number},
      isSet: {type:Boolean,default: false}
    },
    storeid: String,//not needed remove later
    email: String,
    contact_no:String,
    admin:Boolean,
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

const reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};
UserSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('user_password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.user_password, salt, function(err, hash) {
            if (err) return next(err);

            user.user_password = hash;
            next();
        });
    });
});

UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.virtual('city').get(function() { return this.administrative_area_level_1; });

UserSchema.methods.incLoginAttempts = function(cb) {

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, cb);
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {


  this.findOne({ user_name: username }, function(err, user) {

    if (err) return cb(err);

    if (!user) {
      return cb(null, null, reasons.NOT_FOUND);
    }


    if (user.isLocked) {
      return user.incLoginAttempts(function(err) {
        if (err) return cb(err);
        return cb(null, null, reasons.MAX_ATTEMPTS);
      });
    }


    user.comparePassword(password, function(err, isMatch) {
      console.log(password);
      if (err) return cb(err);


      if (isMatch) {

        if (!user.loginAttempts && !user.lockUntil) return cb(null, user);

        const updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        return user.update(updates, function(err) {
          if (err) return cb(err);
          return cb(null, user);
        });
      }

      user.incLoginAttempts(function(err) {
        if (err) return cb(err);
        return cb(null, null, reasons.PASSWORD_INCORRECT);
      });
    });
  });
};


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.user_password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

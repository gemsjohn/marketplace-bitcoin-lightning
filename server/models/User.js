const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const FORSALE = require('./ForSale').schema;
const WANTED = require('./Wanted').schema;
const WATCH = require('./Watch').schema;
const PFC = require('./Pfc').schema;


const userSchema = new Schema(
  {
    role: {
      type: [String],
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    profilepicture: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    upvote: {
      type: [String],
      required: true,
    },
    downvote: {
      type: [String],
      required: true,
    },
    primarylocation: {
      type: String,
      required: true,
    },
    listinglocationarray: {
      type: [String],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    forsalelist: [FORSALE],
    wantedlist: [WANTED],
    watchlist: [WATCH],
    pfclist: [PFC],
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: String,
    }
  },
  
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
// userSchema.virtual('bookCount').get(function () {
//   return this.savedBooks.length;
// });

const User = model('User', userSchema);

module.exports = User;

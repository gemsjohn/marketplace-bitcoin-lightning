const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    commid: {
      type: String
    },
    userid: {
      type: String
    },
    profilepicture: {
      type: String
    },
    verified: {
      type: Boolean
    },
    message: {
      type: String
    },
    username: {
      type: String
    },
    datetime: {
      type: String
    }
  },
);

const MESSAGES = model('MESSAGES', MessageSchema);

module.exports = MESSAGES;
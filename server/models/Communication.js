const { Schema, model } = require('mongoose');

const MESSAGES = require('./Messages').schema;

const CommunicationSchema = new Schema(
  {
    pfcid: {
      type: String
    },
    messages: [MESSAGES],
    status: {
      type: Boolean
    },
    username: {
      type: String
    },
    date: {
      type: String
    }
  },
);

const COMM = model('COMM', CommunicationSchema);

module.exports = COMM;
const { Schema, model } = require('mongoose');

const WatchSchema = new Schema(
  {
    listingid: {
      type: String
    },
    userid: {
      type: String
    },
    title: {
      type: String
    },
    media: {
      type: String
    }
  },
);

const WATCH = model('WATCH', WatchSchema);

module.exports = WATCH;

const { Schema, model } = require('mongoose');

const WantedSchema = new Schema(
  {
    listingid: {
      type: String
    },
    userid: {
      type: String
    },
  },
);

const WANTED = model('WANTED', WantedSchema);

module.exports = WANTED;

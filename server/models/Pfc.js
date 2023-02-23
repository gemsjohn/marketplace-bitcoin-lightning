const { Schema, model } = require('mongoose');

const COMM = require('./Communication').schema;

const PFCSchema = new Schema(
  {
    listingid: {
      type: String
    },
    listingtitle: {
      type: String
    },
    listingcreatorid: {
      type: String
    },
    userid: {
      type: String
    },
    bool: {
      type: Boolean
    },
    communication: [COMM],
    eventid: {
      type: String
    }
  },
);

const PFC = model('PFC', PFCSchema);

module.exports = PFC;

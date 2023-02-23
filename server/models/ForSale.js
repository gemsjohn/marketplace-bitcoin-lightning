const { Schema, model } = require('mongoose');

const ForSaleSchema = new Schema(
  {
    listingid: {
      type: String
    },
    userid: {
      type: String
    },
  },
);

const FORSALE = model('FORSALE', ForSaleSchema);

module.exports = FORSALE;

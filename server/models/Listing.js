const { Schema, model } = require('mongoose');

const WATCH = require('./Watch').schema;
const PFC = require('./Pfc').schema;

const listingSchema = new Schema(
  {
    forsale: {
      type: Boolean,
      required: true
    },
    wanted: {
      type: Boolean,
      required: true
    },
    creatorid: {
      type: String,
      required: true
    },
    creatorusername: {
      type: String,
      required: true
    },
    creatorprofilepicture: {
      type: String,
    },
    creatorverified: {
      type: Boolean
    },
    title:
    {
      type: String,
      required: true
    },
    price: 
    {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    condition: {
      type: String, 
      required: true
    },
    contact: {
      type: String, 
    },
    fileid: [
      {
        type: String,
        required: true
      }
    ],
    media: [
      {
        type: String,
        required: true
      },
    ],
    date: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    },
    watchlist: [WATCH],
    pfclist: [PFC],
  }
);

const Listing = model('Listing', listingSchema)

module.exports = Listing;

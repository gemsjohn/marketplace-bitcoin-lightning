// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

  type User {
    _id: ID
    role: [String]
    username: String
    email: String
    profilepicture: String
    verified: Boolean,
    upvote: [String]
    downvote: [String]
    primarylocation: String
    listinglocationarray: [String]
    forsalelist: [ForSaleList]
    wantedlist: [WantedList]
    watchlist: [WatchList]
    pfclist: [PFCList]
    resetToken: String
    resetTokenExpiry: String
  }

  type Listing {
    _id: ID
    forsale: Boolean
    wanted: Boolean
    creatorid: String
    creatorusername: String
    creatorprofilepicture: String
    creatorverified: Boolean,
    title: String
    price: String
    description: String
    category: String
    condition: String
    fileid: [String]
    media: [String]
    date: String
    location: String
    latitude: String
    longitude: String
    watchlist: [WatchList]
    pfclist: [PFCList]
  }

  type ForSaleList {
    _id: ID
    listingid: String
    userid: String
  }
  type WantedList {
    _id: ID
    listingid: String
    userid: String
  }
  type WatchList {
    _id: ID
    listingid: String
    userid: String
    title: String
    media: String
  }
  type PFCList {
    _id: ID
    listingid: String
    listingtitle: String
    listingcreatorid: String
    userid: String
    bool: Boolean
    communication: [Communication]
    eventid: String
  }

  type Communication {
    _id: ID
    pfcid: String
    messages: [Messages]
    status: Boolean
    username: String
    date: String
  }

  type Messages {
    _id: ID!
    userid: String
    profilepicture: String
    verified: Boolean
    message: String
    datetime: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type UsersResult {
    users: [User]
  }
  type ListingResult {
    listings: [Listing]
  }
  type ForSaleListingResults {
    listings: [Listing]
  }
  type WantedListingResults {
    listings: [Listing]
  }
  type CategoryListingResults {
    listings: [Listing]
  }
  type CreatorListingResults {
    listings: [Listing]
  }

  type Query {
    staticuser: User
    me: User
    users: [User]
    user(_id: ID!): User
    listings: [Listing]
    listing(_id: ID!): Listing

    getUsers(search: String): UsersResult
    getListingByLocation(search: String): ListingResult
    getListingByCategory(search: String): CategoryListingResults
    getListingQuery(search: String): ListingResult
    getListingByID(search: String): ListingResult

    getListingCategory(search: String): CategoryListingResults
    getListingByCreatorID(search: String): CreatorListingResults
    
    getPFCList: [PFCList]
    getWatchList: [WatchList]
    getCommunication: [Communication]
  }

  type Mutation {
    login(
      username: String!, 
      password: String!
    ): Auth

    addUser(
      role: [String!],
      username: String!, 
      email: String!,
      profilepicture: String,
      verified: Boolean,
      upvote: [String],
      downvote: [String],
      primarylocation: String,
      listinglocationarray: [String], 
      password: String!,
    ): Auth

    addListing(
      forsale: Boolean,
      wanted: Boolean,
      title: String,
      price: String,
      description: String,
      category: String,
      condition: String,
      fileid: [String],
      media: [String],
      date: String,
      location: String,
      latitude: String,
      longitude: String,
      watchlist: [String]
      pfclist: [String],
    ): Listing

    updateListing(
      id: ID!
      forsale: Boolean,
      wanted: Boolean,
      creatorid: String,
      creatorusername: String,
      creatorprofilepicture: String,
      creatorverified: Boolean,
      title: String,
      price: String,
      description: String,
      category: String,
      condition: String,
      media: [String],
      location: String,
      latitude: String,
      longitude: String,
    ): Listing

    addToWatchList(listingid: String!, userid: String!, title: String!, media: String!): WatchList
    removeFromWatchList(id: ID!, listingid: String): String

    addToPFCList(listingid: String!, listingtitle: String!, listingcreatorid: String!, userid: String!, bool: Boolean!, communication: [String], eventid: String!): PFCList
    updatePFCList(id: ID!, listingid: String!, listingtitle: String!, listingcreatorid: String!, userid: String!, bool: Boolean, communication: [String], eventid: String!): PFCList
    removeFromPFCList(id: ID!, listingid: String): String

    initCommunication(pfcid: String, messages: [String], status: Boolean, username: String, date: String): Communication
    
    createNewMessage(
      commid: String
      userid: String
      profilepicture: String
      verified: Boolean,
      message: String
      username: String
    ): Messages

    removeMessage(
      commid: String
    ): String

    deleteListing(id: ID!): String
    deleteUser(id: ID!): String

    updateUser(
      username: String, 
      email: String,
      profilepicture: String,
      primarylocation: String,
      verified: Boolean
    ): User
    
    updateUserPassword(
      password: String
    ): User

    requestReset(
      email: String
    ): User

    resetPassword(
      email: String
      password: String
      confirmPassword: String
      resetToken: String
    ): User

    updateUserUpVote(
      _id: ID!
      upvote: [String]
    ): User

    updateUserDownVote(
      _id: ID!
      downvote: [String]
    ): User

    updateUserLocation(
      _id: ID!
      listinglocationarray: [String]
    ): User
    
  }
  
`;

// export the typeDefs
module.exports = typeDefs;
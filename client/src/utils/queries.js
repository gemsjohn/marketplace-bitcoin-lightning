import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Query {
    me {
      _id
      role
      username
      email
      profilepicture
      verified
      upvote
      downvote
      primarylocation
      forsalelist {
        _id
        listingid
        userid
      }
      wantedlist {
        _id
        listingid
        userid
      }
      watchlist {
        _id
        listingid
        userid
        title
        media
      }
      pfclist {
        _id
        listingid
        listingtitle
        listingcreatorid
        userid
        bool
        communication {
          _id
          pfcid
          messages {
            _id
            userid
            message
            datetime
            username
          }
          status
          username
          date
        }
        eventid
      }
    }
  }
`;

export const GET_USERS = gql`
  query Query {
    users {
      _id
      role
      username
      email
      profilepicture
      verified
      upvote
      downvote
      forsalelist {
        _id
        listingid
        userid
      }
      wantedlist {
        _id
        listingid
        userid
      }
      watchlist {
        _id
        listingid
        userid
        title
        media
      }
      pfclist {
        _id
        listingid
        listingtitle
        listingcreatorid
        userid
        bool
        communication {
          _id
          pfcid
          messages {
            _id
            userid
            message
            datetime
            username
          }
          status
          username
          date
        }
        eventid
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query User($id: ID!) {
    user(_id: $id) {
      _id
      role
      username
      email
      profilepicture
      verified
      upvote
      downvote
      primarylocation
      listinglocationarray
      forsalelist {
        _id
        listingid
        userid
      }
      wantedlist {
        _id
        listingid
        userid
      }
      watchlist {
        _id
        listingid
        userid
        title
        media
      }
      pfclist {
        _id
        listingid
        listingtitle
        listingcreatorid
        userid
        bool
        communication {
          _id
          pfcid
          messages {
            _id
            userid
            message
            datetime
            username
          }
          status
          username
          date
        }
        eventid
      }
    }
  }
`;

export const GET_LISTINGS = gql`
  query Query {
    listings {
      _id
      forsale
      wanted
      creatorid
      creatorusername
      creatorprofilepicture
      creatorverified
      title
      price
      description
      category
      condition
      fileid
      media
      date
      location
      latitude
      longitude
      watchlist {
        _id
        listingid
        userid
        title
        media
      }
      pfclist {
        _id
        listingid
        listingtitle
        listingcreatorid
        userid
        bool
        communication {
          _id
          pfcid
          messages {
            _id
            userid
            message
            datetime
            username
          }
          status
          username
          date
        }
        eventid
      }
    }
  }
`;


export const GET_LISTING_BY_ID = gql`
  query Listing($id: ID!) {
    listing(_id: $id) {
      _id
      forsale
      wanted
      creatorid
      creatorusername
      creatorprofilepicture
      creatorverified
      title
      price
      description
      category
      condition
      fileid
      media
      date
      location
      latitude
      longitude
      watchlist {
        _id
        listingid
        userid
        title
        media
      }
      pfclist {
        _id
        listingid
        listingtitle
        listingcreatorid
        userid
        bool
        communication {
          _id
          pfcid
          messages {
            _id
            userid
            message
            datetime
            username
          }
          status
          username
          date
        }
        eventid
      }
    }
  }
`;

export const SEARCH_QUERY = gql`
  query GetListingQuery($search: String) {
    getListingQuery(search: $search) {
      listings {
        _id
        title
        description
        media
        forsale
        wanted
      }
    }
  }
`;

export const SEARCH_USER_QUERY = gql`
  query GetUsers($search: String) {
    getUsers(search: $search) {
      users {
        username
        email
        profilepicture
        verified
        upvote
        downvote
        forsalelist {
          _id
          listingid
          userid
        }
        wantedlist {
          _id
          listingid
          userid
        }
      }
    }
  }
`;

export const SEARCH_LISTING_BY_ID = gql`
  query GetListingByID($search: String) {
    getListingByID(search: $search) {
      listings {
        _id
        forsale
        wanted
        creatorid
        creatorusername
        creatorprofilepicture
        creatorverified
        title
        price
        description
        category
        condition
        fileid
        media
        date
        location
        latitude
        longitude
        watchlist {
          _id
          listingid
          userid
          title
          media
        }
        pfclist {
          _id
          listingid
          listingtitle
          listingcreatorid
          userid
          bool
          communication {
            _id
            pfcid
            messages {
              _id
              userid
              message
              datetime
              username
            }
            status
            username
            date
          }
          eventid
        }
      }
    }
  }
`;

export const SEARCH_LISTING_QUERY = gql`
  query Query($search: String) {
    getListingByLocation(search: $search) {
      listings {
        _id
        title
        description
        media
        forsale
        wanted
        location
      }
    }
  }
`;
export const SEARCH_LISTING_QUERY_CATEGORY = gql`
  query Query($search: String) {
    getListingByCategory(search: $search) {
      listings {
        _id
        title
        description
        media
        forsale
        wanted
        category
      }
    }
  }
`;

export const SEARCH_LISTING_CATEGORY_QUERY = gql`
  query Query($search: String) {
    getListingCategory(search: $search) {
      listings {
        category
      }
    }
  }
`;

export const GET_PFC_LIST = gql`
  query Query {
    getPFCList {
      _id
      listingid
      listingtitle
      listingcreatorid
      userid
      bool
      communication {
        _id
        pfcid
        messages {
          _id
          userid
          message
          datetime
        }
        status
        username
        date
      }
      eventid
    }
  }
`;

export const GET_WATCHLIST = gql`
  query Query {
    getWatchList {
      _id
      listingid
      userid
    }
  }
`;

export const GET_COMMUNICATION = gql`
  query Query {
    getCommunication {
      _id
      pfcid
      messages {
        _id
        userid
        message
        datetime
      }
      status
      username
      date
    }
  }
`;

export const GET_LISTING_BY_CREATOR_ID = gql`
  query GetListingByCreatorID($search: String) {
    getListingByCreatorID(search: $search) {
      listings {
        _id
        creatorid
        creatorusername
        creatorprofilepicture
        creatorverified
        title
        price
        date
        fileid
        media
        location
        forsale
        wanted
      }
    }
  }
`;
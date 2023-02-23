import { gql } from "@apollo/client";


export const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
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

export const ADD_USER = gql`
  mutation Mutation($role: [String!], $username: String!, $email: String!, $profilepicture: String, $verified: Boolean, $upvote: [String], $downvote: [String], $primarylocation: String, $listinglocationarray: [String], $password: String!) {
    addUser(role: $role, username: $username, email: $email, profilepicture: $profilepicture, verified: $verified, upvote: $upvote, downvote: $downvote, primarylocation: $primarylocation, listinglocationarray: $listinglocationarray, password: $password) {
      token
      user {
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
  }
`;

export const ADD_LISTING = gql`
  mutation AddListing($forsale: Boolean, $wanted: Boolean, $title: String, $price: String, $description: String, $category: String, $condition: String, $fileid: [String], $media: [String], $date: String, $location: String, $latitude: String, $longitude: String, $watchlist: [String], $pfclist: [String]) {
    addListing(forsale: $forsale, wanted: $wanted, title: $title, price: $price, description: $description, category: $category, condition: $condition, fileid: $fileid, media: $media, date: $date, location: $location, latitude: $latitude, longitude: $longitude, watchlist: $watchlist, pfclist: $pfclist) {
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

export const UPDATE_LISTING = gql`
  mutation Mutation($updateListingId: ID!, $forsale: Boolean, $wanted: Boolean, $creatorid: String, $creatorusername: String, $creatorprofilepicture: String, $creatorverified: Boolean, $title: String, $price: String, $description: String, $category: String, $condition: String, $media: [String], $location: String, $latitude: String, $longitude: String) {
    updateListing(id: $updateListingId, forsale: $forsale, wanted: $wanted, creatorid: $creatorid, creatorusername: $creatorusername, creatorprofilepicture: $creatorprofilepicture, creatorverified: $creatorverified, title: $title, price: $price, description: $description, category: $category, condition: $condition, media: $media, location: $location, latitude: $latitude, longitude: $longitude) {
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

export const ADD_WATCHLIST = gql`
  mutation Mutation($listingid: String!, $userid: String!, $title: String!, $media: String!) {
    addToWatchList(listingid: $listingid, userid: $userid, title: $title, media: $media) {
      _id
      listingid
      userid
      title
      media
    }
  }
`;

export const REMOVE_FROM_WATCHLIST = gql`
  mutation RemoveFromWatchList($removeFromWatchListId: ID!, $listingid: String) {
    removeFromWatchList(id: $removeFromWatchListId, listingid: $listingid)
  }
`;

export const ADD_TO_PFC_LIST = gql`
  mutation Mutation($listingid: String!, $listingtitle: String!, $listingcreatorid: String!, $userid: String!, $bool: Boolean!, $eventid: String!, $communication: [String]) {
    addToPFCList(listingid: $listingid, listingtitle: $listingtitle, listingcreatorid: $listingcreatorid, userid: $userid, bool: $bool, eventid: $eventid, communication: $communication) {
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
`;

export const UPDATE_PFC_LIST = gql`
  mutation UpdatePFCList($updatePfcListId: ID!, $listingid: String!, $listingtitle: String!, $listingcreatorid: String!, $userid: String!, $eventid: String!, $bool: Boolean, $communication: [String]) {
    updatePFCList(id: $updatePfcListId, listingid: $listingid, listingtitle: $listingtitle, listingcreatorid: $listingcreatorid, userid: $userid, eventid: $eventid, bool: $bool, communication: $communication) {
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
`;

export const REMOVE_FROM_PFC_LIST = gql`
  mutation RemoveFromPFCList($removeFromPfcListId: ID!, $listingid: String) {
    removeFromPFCList(id: $removeFromPfcListId, listingid: $listingid)
  }
`;

export const INIT_COMMUNICATION = gql`
  mutation Mutation($pfcid: String, $messages: [String], $status: Boolean, $username: String, $date: String) {
    initCommunication(pfcid: $pfcid, messages: $messages, status: $status, username: $username, date: $date) {
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
  }
`;

export const CREATE_NEW_MESSAGE = gql`
  mutation Mutation($commid: String, $userid: String, $message: String, $username: String) {
    createNewMessage(commid: $commid, userid: $userid, message: $message, username: $username) {
      _id
      userid
      message
      datetime
      username
    }
  }
`;

export const REMOVE_MESSAGE = gql`
  mutation RemoveMessage($commid: String) {
    removeMessage(commid: $commid)
  }
`;

export const DELETE_LISTING = gql`
  mutation DeleteListing($deleteListingId: ID!) {
    deleteListing(id: $deleteListingId)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($username: String, $email: String, $profilepicture: String, $verified: Boolean, $primarylocation: String) {
    updateUser(username: $username, email: $email, profilepicture: $profilepicture, verified: $verified, primarylocation: $primarylocation) {
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
            profilepicture
            verified
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

export const UPDATE_USER_PASSWORD = gql`
  mutation Mutation($password: String) {
    updateUserPassword(password: $password) {
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

export const UPDATE_USER_UP_VOTE = gql`
  mutation Mutation($id: ID!, $upvote: [String]) {
    updateUserUpVote(_id: $id, upvote: $upvote) {
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

export const UPDATE_USER_DOWN_VOTE = gql`
  mutation Mutation($id: ID!, $downvote: [String]) {
    updateUserDownVote(_id: $id, downvote: $downvote) {
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

export const UPDATE_USER_LOCATION = gql`
  mutation UpdateUserLocation($id: ID!, $listinglocationarray: [String]) {
    updateUserLocation(_id: $id, listinglocationarray: $listinglocationarray) {
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

export const REQUEST_RESET = gql`
  mutation Mutation($email: String) {
    requestReset(email: $email) {
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
            profilepicture
            verified
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
      resetToken
      resetTokenExpiry
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String, $password: String, $confirmPassword: String, $resetToken: String) {
    resetPassword(email: $email, password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
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
            profilepicture
            verified
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
      resetToken
      resetTokenExpiry
    }
  }
`;




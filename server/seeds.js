require('dotenv').config();
const mongoose = require('mongoose');
const { User, Listing, FORSALE, WANTED, WATCH, PFC, COMM, MESSAGES } = require('./models');
const bcrypt = require('bcrypt');
const { signToken } = require('./utils/auth');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Patina', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const seedUserAccounts = [
    {
        "_id": "000000000000000000000001",
        "role": [
            "Admin"
        ],
        "username": "super_user1",
        "password": `${process.env.REACT_APP_SUPER_USER_PASSWORD}`,
        "email": "honestpatina@gmail.com",
        "profilepicture": "",
        "verified": true,
        "upvote": "0",
        "downvote": "0",
        "primarylocation": "Durham, North Carolina, US",
        "listinglocationarray": [],
        "forsalelist": [],
        "wantedlist": [],
        "watchlist": [],
        "pfclist": [],
        "resetToken": "",
        "resetTokenExpiry": ""
    },
    {
        "_id": "000000000000000000000002",
        "role": [
            "Admin"
        ],
        "username": "super_user2",
        "password": `${process.env.REACT_APP_SUPER_USER_PASSWORD}`,
        "email": "honestpatinamarket@gmail.com",
        "profilepicture": "",
        "verified": true,
        "upvote": "0",
        "downvote": "0",
        "primarylocation": "Durham, North Carolina, US",
        "listinglocationarray": [],
        "forsalelist": [],
        "wantedlist": [],
        "watchlist": [],
        "pfclist": [],
        "resetToken": "",
        "resetTokenExpiry": ""
    }
]

const seedDB = async () => {
    const user = await User.create(seedUserAccounts);
    signToken(user);
};

seedDB().then(() => {
    mongoose.connection.close();
})
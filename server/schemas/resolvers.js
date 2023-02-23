require('dotenv').config();
const { AuthenticationError } = require('apollo-server-express');
const { User, Listing, FORSALE, WANTED, WATCH, PFC, COMM, MESSAGES } = require("../models");
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');
const moment = require('moment');
const axios = require('axios');
const { promisify } = require("es6-promisify");
const randomBytes = require('randombytes');
const nodemailer = require("nodemailer");
const Sequelize = require('sequelize');
const InitialEmail = require('../InitialEmail')

const urlEndpoint = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`;

const resolvers = {
  Query: {
    staticuser(parent, { id }) {
      return StaticUsers.find(user => user.id === id);
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('forsalelist')
          .populate('wantedlist')
          .populate('watchlist')
          .populate('pfclist')

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('forsalelist')
        .populate('wantedlist')
        .populate('watchlist')
        .populate('pfclist')
    },
    // single user by username
    user: async (parent, { _id }) => {
      console.log(_id)
      return User.findOne({ _id })
        // .select('-__v -password')
        .populate('forsalelist')
        .populate('wantedlist')
        .populate('watchlist')
        .populate('pfclist')
    },
    // listings
    listings: async () => {
      return Listing.find().sort({ createdAt: -1 })
        .populate('watchlist')
        .populate('pfclist')
    },
    // single listing
    listing: async (parent, { _id }) => {
      return Listing.findOne({ _id })
        .populate('watchlist')
        .populate('pfclist')
    },
    getPFCList: async () => {
      return PFC.find().sort({ createdAt: -1 })
    },
    getWatchList: async () => {
      return WATCH.find().sort({ createdAt: -1 })
    },
    getCommunication: async () => {
      return COMM.find().sort({ createdAt: -1 })
    },
    getUsers: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        };
      }

      const users = await User.find(searchQuery);

      return {
        users,
      };
    },
    getListingQuery: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        };
      }

      const listings = await Listing.find(searchQuery);

      return {
        listings
      }
    },
    getListingByID: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = { _id: { $regex: search, $options: 'i' } };
      }

      const listings = await Listing.find(searchQuery);

      return {
        listings
      }
    },
    // {creatorid: { $regex: search, $options: 'i' }}
    getListingByLocation: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = { location: { $regex: search, $options: 'i' } };
      }

      const listings = await Listing.find(searchQuery);

      return {
        listings
      }
    },
    getListingByCategory: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = { category: { $regex: search, $options: 'i' } };
      }

      const listings = await Listing.find(searchQuery);

      return {
        listings
      }
    },
    getListingByCreatorID: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { creatorid: { $regex: search, $options: 'i' } },
          ],
        };
      }

      const listings = await Listing.find(searchQuery);

      return {
        listings
      }
    },
    getListingCategory: async (parent, args) => {
      const { search } = args;

      let searchQuery = {};

      if (search) {
        searchQuery = { category: { $regex: search, $options: 'i' } };

        const listingcategory = await Listing.find(searchQuery);

        return {
          listingcategory
        }
      }
    },
  },

  Mutation: {
    login: async (parent, { username, password, role }) => {
      let lowerCaseUsername = username.toLowerCase();
      const user = await User.findOne({ username: lowerCaseUsername });
      const permission = await User.find({ role });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user, permission };
    },
    addUser: async (parent, args) => {
      let lowerCaseUsername = args.username.toLowerCase();
      let lowerCaseEmail = args.email.toLowerCase();
      console.log(lowerCaseUsername)
      const user = await User.create(
        {
          role: 'User',
          primarylocation: args.primarylocation,
          email: lowerCaseEmail,
          username: lowerCaseUsername,
          password: args.password,
          verified: false,
          upvote: args.upvote,
          downvote: args.downvote,
          listinglocationarray: args.listinglocationarray
        }
      );
      const token = signToken(user);

      InitialEmail(args.username, lowerCaseEmail);
      
      return { token, user };
    },
    updateUser: async (parents, args, context) => {
      if (context.user) {
        // console.log(args.primarylocation)
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            role: context.user.role,
            profilepicture: args.profilepicture,
            primarylocation: args.primarylocation,
            verified: args.verified,
            username: args.username,
            email: args.email,
          },
          { new: true }
        )
        if (user.forsalelist != []) {
          for (let i = 0; i < user.forsalelist.length; i++) {
            const listingForSale = await Listing.findById(user.forsalelist[i].listingid)

            const listingEvent = await Listing.findByIdAndUpdate(
              { _id: user.forsalelist[i].listingid },
              {
                forsale: listingForSale.forsale,
                wanted: listingForSale.wanted,
                title: listingForSale.title,
                price: listingForSale.price,
                description: listingForSale.description,
                category: listingForSale.category,
                condition: listingForSale.condition,
                fileid: listingForSale.fileid,
                media: listingForSale.media,
                date: listingForSale.date,
                location: listingForSale.location,
                latitude: listingForSale.latitude,
                longitude: listingForSale.longitude,
                watchlist: listingForSale.watchlist,
                pfclist: listingForSale.pfclist,
                creatorid: listingForSale.creatorid,
                creatorusername: args.username,
                creatorverified: args.verified
              },
              { new: true }
            )
            // console.log(listingEvent)
          }
        }
        if (user.wantedlist != []) {
          for (let i = 0; i < user.wantedlist.length; i++) {
            const listingWanted = await Listing.findById(user.wantedlist[i].listingid)
            // console.log(listingWanted)
            const listingEvent = await Listing.findByIdAndUpdate(
              { _id: user.wantedlist[i].listingid },
              {
                forsale: listingWanted.forsale,
                wanted: listingWanted.wanted,
                title: listingWanted.title,
                price: listingWanted.price,
                description: listingWanted.description,
                category: listingWanted.category,
                condition: listingWanted.condition,
                fileid: listingWanted.fileid,
                media: listingWanted.media,
                date: listingWanted.date,
                location: listingWanted.location,
                latitude: listingWanted.latitude,
                longitude: listingWanted.longitude,
                watchlist: listingWanted.watchlist,
                pfclist: listingWanted.pfclist,
                creatorid: listingWanted.creatorid,
                creatorusername: args.username,
                creatorverified: args.verified
              },
              { new: true }
            )
            // console.log(listingEvent)
          }
        }
      }
      // throw new AuthenticationError('You need to be logged in!');

    },
    updateUserUpVote: async (parents, args, context) => {
      console.log("UPVOTE")
      const seeUser = await User.findById({ _id: args._id });
      if (seeUser.upvote.length != []) {
        for (let i = 0; i < seeUser.upvote.length; i++) {
          if (context.user._id != seeUser.upvote[i]) {
            await User.findByIdAndUpdate(
              { _id: args._id },
              { $push: { upvote: args.upvote[0] } },
              { new: true }
            )
          }
        }
      } else {
        await User.findByIdAndUpdate(
          { _id: args._id },
          { $push: { upvote: args.upvote[0] } },
          { new: true }
        )
      }
      if (seeUser.downvote.length != []) {
        for (let i = 0; i < seeUser.downvote.length; i++) {
          if (context.user._id === seeUser.downvote[i]) {
            await User.findByIdAndUpdate(
              { _id: args._id },
              { $pull: { downvote: args.upvote[0] } },
              { new: true }
            )
          }
        }
      }

    },
    updateUserDownVote: async (parents, args, context) => {
      console.log("DOWNVOTE")
      const seeUser = await User.findById({ _id: args._id });
      if (seeUser.downvote.length != []) {
        for (let i = 0; i < seeUser.downvote.length; i++) {
          if (context.user._id != seeUser.downvote[i]) {
            await User.findByIdAndUpdate(
              { _id: args._id },
              { $push: { downvote: args.downvote[0] } },
              { new: true }
            )
          }
        }
      } else {
        await User.findByIdAndUpdate(
          { _id: args._id },
          { $push: { downvote: args.downvote[0] } },
          { new: true }
        )
      }
      if (seeUser.upvote.length != []) {
        for (let i = 0; i < seeUser.upvote.length; i++) {
          if (context.user._id === seeUser.upvote[i]) {
            await User.findByIdAndUpdate(
              { _id: args._id },
              { $pull: { upvote: args.downvote[0] } },
              { new: true }
            )
          }
        }
      }

    },
    updateUserLocation: async (parent, args, context) => {
      const user = await User.findByIdAndUpdate(
        { _id: args._id },
        { $push: { listinglocationarray: args.listinglocation } },
        { new: true }
      )
      if (user.listinglocationarray.length >= 3) {
        await User.findByIdAndUpdate(
          { _id: args._id },
          { $pop: { listinglocationarray: -1 } },
          { new: true }
        )
      }
    },
    updateUserPassword: async (parent, { password }, context) => {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (context.user) {
        const result = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            password: hash,
            resetToken: null,
            resetTokenExpiry: null
          },
          {
            where: { _id: context.user._id },
            returning: true,
            plain: true
          }
        );
      }
    },
    requestReset: async (parent, { email }, context) => {
      let lowerCaseEmail = email.toLowerCase();
      const username = `${process.env.REACT_APP_SMTP_USERNAME}`
      const password = `${process.env.REACT_APP_SMTP_PASSWORD}`
      const user = await User.findOne(
        { email: lowerCaseEmail }
      )
      // console.log(user)

      if (!user) throw new Error("No user found with that email.");

      // Create randomBytes that will be used as a token
      const randomBytesPromisified = promisify(randomBytes);
      const resetToken = (await randomBytesPromisified(20)).toString("hex");
      const resetTokenExpiry = Date.now() + 300000; // 5 minutes from now

      const saltRounds = 10;
      const hash = await bcrypt.hash(resetToken, saltRounds);

      const result = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
        },
        { new: true }
      );
      console.log(result)

      let transport = nodemailer.createTransport({
        host: "smtp.dreamhost.com",
        port: 587,
        auth: {
          user: `${username}`,
          pass: `${password}`
        }
      });


      // Email them the token
      const mailRes = await transport.sendMail({
        from: 'admin@honestpatina.com',
        to: user.email,
        subject: "Your Password Reset Token",
        // text: 'Honest Patina email reset token: ' + `${resetToken}`,
        html:
        `
        <body>
          <div style="background-color:#00b8ff; width: 50rem; height:5rem; margin: auto; border-radius: 20px 20px 0 0;"></div>
          <div style="width: 50rem; height:20rem; margin: auto; background-color: #e9ecef;">
              <div style="height: 1rem;"></div>
              <div style="margin: auto; padding: 2rem 0 0 2rem;">
                  <p style="color:black; display: flex; flex-wrap: wrap; justify-content: center; font-size: 3vh;">
                      Honest Patina has received your request to reset your password. The following reset token expires in 5 minutes.  
                  </p>
              </div>
              <p style="color:black; display: flex; flex-wrap: wrap; justify-content: center; font-size: 3vh; margin: 0; padding: 0.25rem 2rem">
                  <strong style="color:#EE9B00;">${resetToken}</strong>  
              </p>
                <a href="https://honestpatina.com/reset" style="color:black; display: flex; flex-wrap: wrap; justify-content: center; text-decoration: none; padding: 2rem">
                  <button style="background-color: #00b8ff; color:white; padding:10px; border-radius:10px; height: 3rem; width: 20rem; font-size: 1rem;">Reset</button>
              </a>        
          </div>
          <div style="background-color:#00b8ff; width: 50rem; height:5rem; margin: auto; border-radius: 0 0 20px 20px;"></div>
        </body>
        `

      });
      console.log(mailRes)

      return true;

    },
    resetPassword: async (parent, { email, password, confirmPassword, resetToken }, { res }) => {
      console.log(resetToken)
      let lowerCaseEmail = email.toLowerCase();
      const Op = Sequelize.Op;

      // check if passwords match
      if (password !== confirmPassword) {
        throw new Error(`Your passwords don't match`);
      }

      // find the user with that resetToken
      // make sure it's not expired
      const user = await User.findOne(
        { resetToken: resetToken },

      );
      console.log(user)

      // throw error if user doesn't exist
      if (!user) {
        throw new Error(
          "Your password reset token is either invalid or expired."
        )
      }
      console.log(Date.now() - user.resetTokenExpiry)
      if (Date.now() > user.resetTokenExpiry) {
        throw new Error(
          "Your password reset token is either invalid or expired."
        )
      } 

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const result = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          password: hash,
          resetToken: "",
          resetTokenExpiry: ""
        }
      );

      console.log(result)


    },
    deleteUser: async (parent, { id }, context) => {
      if (context.user) {
        console.log(context.user.role)
        for (let i = 0; i < context.user.role.length; i++) {
          if (context.user.role[i] === 'Admin') {
            const user = await User.findById(id);
            // [[[FORSALE]]]
            if (user.forsalelist != []) {
              for (let i = 0; i < user.forsalelist.length; i++) {
                const listingresult = await Listing.findById(user.forsalelist[i].listingid);
                for (let i = 0; i < listingresult.pfclist.length; i++) {
                  if (listingresult.pfclist[i].listingid === user.forsalelist[i].listingid) {
                    const testing1 = await PFC.findByIdAndDelete(listingresult.pfclist[i]._id);
                    await User.findOneAndUpdate(
                      { _id: user._id },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );
                    await User.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].userid },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );
                    await Listing.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].listingid },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );
                  }
                }
                for (let i = 0; i < listingresult.watchlist.length; i++) {
                  if (listingresult.watchlist[i].listingid === user.forsalelist[i].listingid) {
                    await WATCH.findByIdAndDelete(id);
                    await User.updateOne(
                      { _id: listingresult.watchlist[i].userid },
                      { $pull: { watchlist: { _id: listingresult.watchlist[i]._id } } },
                    );
                  }
                }
                if (listingresult.forsale) {
                  await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { forsalelist: { listingid: listingresult._id } } },
                  );
                  for (let i = 0; i < listingresult.pfclist.length; i++) {
                    await User.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].userid },
                      { $pull: { forsalelist: { listingid: listingresult._id } } },
                    );
                  }

                }

                const listingresultdelete = await Listing.findByIdAndDelete(user.forsalelist[i].listingid);

              }
            }
            // [[[WANTED]]]
            if (user.wantedlist != []) {
              for (let i = 0; i < user.wantedlist.length; i++) {
                const listingresult = await Listing.findById(user.wantedlist[i].listingid);
                for (let i = 0; i < listingresult.pfclist.length; i++) {
                  if (listingresult.pfclist[i].listingid === user.wantedlist[i].listingid) {
                    const testing1 = await PFC.findByIdAndDelete(listingresult.pfclist[i]._id);
                    await User.findOneAndUpdate(
                      { _id: user._id },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );
                    await User.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].userid },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );
                    await Listing.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].listingid },
                      { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
                    );

                    console.log(testing1)
                  }
                }
                for (let i = 0; i < listingresult.watchlist.length; i++) {
                  if (listingresult.watchlist[i].listingid === user.wantedlist[i].listingid) {
                    await WATCH.findByIdAndDelete(id);
                    await User.updateOne(
                      { _id: listingresult.watchlist[i].userid },
                      { $pull: { watchlist: { _id: listingresult.watchlist[i]._id } } },
                    );
                  }
                }
                if (listingresult.wanted) {
                  await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { wantedlist: { listingid: listingresult._id } } },
                  );
                  for (let i = 0; i < listingresult.pfclist.length; i++) {
                    console.log(listingresult.pfclist[i].userid)
                    await User.findOneAndUpdate(
                      { _id: listingresult.pfclist[i].userid },
                      { $pull: { forsalelist: { listingid: listingresult._id } } },
                    );
                  }
                }

                const listingresultdelete = await Listing.findByIdAndDelete(user.wantedlist[i].listingid);
              }
            }
            // [[[WATCHLIST]]]
            if (user.watchlist != []) {
              for (let i = 0; i < user.watchlist.length; i++) {
                console.log("WATCH LIST")
                console.log(user.watchlist[i]._id)
                await WATCH.findByIdAndDelete(user.watchlist[i]._id);
                await User.updateOne(
                  { _id: user._id },
                  { $pull: { watchlist: { _id: user.watchlist[i]._id } } },
                );
                await Listing.updateOne(
                  { _id: user.watchlist[i].listingid },
                  { $pull: { watchlist: { _id: user.watchlist[i]._id } } },
                );

                return console.log("removed");
              }
            }
            // [[[UPDATE USER: LOCKED]]]
            await User.findByIdAndDelete(
              { _id: user._id },
              // {
              //   role: "Locked",
              //   profilepicture: user.profilepicture,
              //   verified: false,
              //   username: user.username,
              //   email: user.email,
              // },
              // { new: true }
            )

            return id;
          } else {
            console.log('Permissionless')
          }
        }
      }

    },
    addListing: async (parent, args, context) => {

      if (context.user) {
        console.log(context.user)
        const listing = await Listing.create({
          ...args,
          creatorid: context.user._id,
          creatorusername: context.user.username,
          creatorverified: context.user.verified
        });
        if (listing.forsale) {
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { forsalelist: { listingid: listing._id, userid: context.user._id } } },
            { new: true }
          );
        } else if (listing.wanted) {
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { wantedlist: { listingid: listing._id, userid: context.user._id } } },
            { new: true }
          );
        }
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { listinglocationarray: args.location } },
          { new: true }
        )
        if (user.listinglocationarray.length > 4) {
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pop: { listinglocationarray: -1 } },
            { new: true }
          )
        }

        return listing;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    updateListing: async (parents, args, context) => {
      if (context.user._id == args.creatorid) {
        const ListingEvent = await Listing.findByIdAndUpdate(
          { _id: args.id },
          {
            forsale: args.forsale,
            wanted: args.wanted,
            title: args.title,
            price: args.price,
            description: args.description,
            category: args.category,
            condition: args.condition,
            media: args.media,
            location: args.location,
            latitude: args.latitude,
            longitude: args.longitude,
          },
          { new: true }
        )
        console.log(ListingEvent)
        return ListingEvent;
      }
      // throw new AuthenticationError('You need to be logged in!');

    },
    deleteListing: async (parent, { id }, context) => {

      if (context) {
        const listingresult = await Listing.findById(id);

        for (let i = 0; i < listingresult.pfclist.length; i++) {
          if (listingresult.pfclist[i].listingid === id) {
            const testing1 = await PFC.findByIdAndDelete(listingresult.pfclist[i]._id);
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
            );
            await User.findOneAndUpdate(
              { _id: listingresult.pfclist[i].userid },
              { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
            );
            await Listing.findOneAndUpdate(
              { _id: listingresult.pfclist[i].listingid },
              { $pull: { pfclist: { _id: listingresult.pfclist[i]._id } } },
            );

            console.log(testing1)
          }
        }
        for (let i = 0; i < listingresult.watchlist.length; i++) {
          if (listingresult.watchlist[i].listingid === id) {
            await WATCH.findByIdAndDelete(id);
            await User.updateOne(
              { _id: listingresult.watchlist[i].userid },
              { $pull: { watchlist: { _id: listingresult.watchlist[i]._id } } },
            );
          }
        }
        if (listingresult.forsale) {
          await User.findOneAndUpdate(
            { _id: listingresult.creatorid },
            { $pull: { forsalelist: { listingid: listingresult._id } } },
          );
          for (let i = 0; i < listingresult.pfclist.length; i++) {
            await User.findOneAndUpdate(
              { _id: listingresult.pfclist[i].userid },
              { $pull: { forsalelist: { listingid: listingresult._id } } },
            );
          }

        } else if (listingresult.wanted) {
          await User.findOneAndUpdate(
            { _id: listingresult.creatorid },
            { $pull: { wantedlist: { listingid: listingresult._id } } },
          );
          for (let i = 0; i < listingresult.pfclist.length; i++) {
            console.log(listingresult.pfclist[i].userid)
            await User.findOneAndUpdate(
              { _id: listingresult.pfclist[i].userid },
              { $pull: { forsalelist: { listingid: listingresult._id } } },
            );
          }
        }

        const listingresultdelete = await Listing.findByIdAndDelete(id);
        // console.log(listingresultdelete);

        return id;
      }
    },

    addToWatchList: async (parent, args, context) => {
      const WATCHEvent = await WATCH.create({
        ...args,
      });

      await User.findByIdAndUpdate(
        { _id: args.userid },
        { $push: { watchlist: { _id: WATCHEvent._id, listingid: args.listingid, userid: context.user._id, title: args.title, media: args.media } } },
        { new: true },
      )

      await Listing.findByIdAndUpdate(
        args.listingid,
        { $push: { watchlist: { _id: WATCHEvent._id, listingid: args.listingid, userid: context.user._id, title: args.title, media: args.media } } },
        { new: true },
      );

    },
    removeFromWatchList: async (parent, { id, listingid }, context) => {
      if (context.user) {
        await WATCH.findByIdAndDelete(id);
        await User.updateOne(
          { _id: context.user._id },
          { $pull: { watchlist: { _id: id } } },
        );
        await Listing.updateOne(
          { _id: listingid },
          { $pull: { watchlist: { _id: id } } },
        );

        return console.log("removed");
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    addToPFCList: async (parent, args, context) => {
      const PFCEvent = await PFC.create({
        ...args,
      });
      console.log("ADD TO PFC LIST")
      console.log(args)

      await User.findByIdAndUpdate(
        { _id: args.userid },
        { $addToSet: { pfclist: { _id: PFCEvent._id, listingid: args.listingid, listingtitle: args.listingtitle, listingcreatorid: args.listingcreatorid, userid: args.userid, bool: args.bool, communication: args.communication, eventid: args.eventid } } },
        { new: true },
      );

      await Listing.findByIdAndUpdate(
        args.listingid,
        { $addToSet: { pfclist: { _id: PFCEvent._id, listingid: args.listingid, listingtitle: args.listingtitle, listingcreatorid: args.listingcreatorid, userid: args.userid, bool: args.bool, communication: args.communication, eventid: args.eventid } } },
        { new: true },
      );

    },
    updatePFCList: async (parents, args) => {
      await PFC.findByIdAndUpdate(
        { _id: args.id },
        {
          bool: args.bool
        },
        { new: true }
      )
    },
    initCommunication: async (parents, args) => {
      const communication = await COMM.create({
        ...args,
      });

      let docA = await PFC.findOne({ _id: args.pfcid })
      let docB = await Listing.findOne({ _id: docA.listingid })

      await Listing.updateOne(
        { _id: docB._id },
        { $pull: { pfclist: { _id: docA._id } } },
      );

      await Listing.findOneAndUpdate(
        { _id: docB._id },
        {
          $push: {
            pfclist: {
              _id: docA._id,
              listingid: docB._id,
              listingtitle: docB.title,
              listingcreatorid: docA.listingcreatorid,
              userid: docA.userid,
              bool: docA.bool,
              communication: { _id: communication._id, messages: args.messages, pfcid: args.pfcid, status: args.status, username: args.username, date: args.date },
              eventid: docA.eventid
            }
          }
        },
        { new: true },
      );

      await User.updateOne(
        { _id: docA.userid },
        { $pull: { pfclist: { _id: docA._id } } },
      );

      await User.findOneAndUpdate(
        { _id: docB._id },
        {
          $push: {
            pfclist: {
              _id: docA._id,
              listingid: docB._id,
              listingtitle: docB.title,
              listingcreatorid: docA.listingcreatorid,
              userid: docA.userid,
              bool: docA.bool,
              communication: { _id: communication._id, messages: args.messages, pfcid: args.pfcid, status: args.status, username: args.username, date: args.date },
              eventid: docA.eventid
            }
          }
        },
        { new: true },
      );
    },
    createNewMessage: async (parents, args) => {
      const messagebody = await MESSAGES.create({
        ...args,
      });

      const COMMEvent = await COMM.findByIdAndUpdate(
        { _id: messagebody.commid },
        { $push: { messages: { message: messagebody.message, userid: messagebody.userid, username: messagebody.username, datetime: moment().format('llll') } } },
        { new: true }
      )

      let docA = await PFC.findOne({ _id: COMMEvent.pfcid })
      let docB = await Listing.findOne({ _id: docA.listingid })

      console.log(docA)

      await Listing.updateOne(
        { _id: docB._id },
        { $pull: { pfclist: { _id: docA._id } } },
      );

      await Listing.findOneAndUpdate(
        { _id: docB._id },
        {
          $push: {
            pfclist: {
              _id: docA._id,
              listingid: docB._id,
              listingtitle: docB.title,
              listingcreatorid: docA.listingcreatorid,
              userid: docA.userid,
              bool: docA.bool,
              communication: {
                _id: COMMEvent._id,
                messages: COMMEvent.messages,
                pfcid: COMMEvent.pfcid,
                status: COMMEvent.status,
                username: COMMEvent.username,
                date: COMMEvent.date
              },
              eventid: docA.eventid
            }
          }
        },
        { new: true },
      );

      await User.updateOne(
        { _id: docA.userid },
        { $pull: { pfclist: { _id: docA._id } } },
      );

      await User.findOneAndUpdate(
        { _id: docA.userid },
        {
          $push: {
            pfclist: {
              _id: docA._id,
              listingid: docB._id,
              listingtitle: docB.title,
              listingcreatorid: docA.listingcreatorid,
              userid: docA.userid,
              bool: docA.bool,
              communication: {
                _id: COMMEvent._id,
                messages: COMMEvent.messages,
                pfcid: COMMEvent.pfcid,
                status: COMMEvent.status,
                username: COMMEvent.username,
                date: COMMEvent.date
              },
              eventid: docA.eventid
            }
          }
        },
        { new: true },
      );
    },
    removeMessage: async (parents, { commid }) => {
      const COMMEvent = await COMM.findByIdAndDelete({ _id: commid });
      return COMMEvent;
    },
    removeFromPFCList: async (parent, { id, listingid }, context) => {
      if (context.user) {
        await PFC.findByIdAndDelete(id);
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { pfclist: { _id: id } } },
        );
        await Listing.findOneAndUpdate(
          { _id: listingid },
          { $pull: { pfclist: { _id: id } } },
        );
      }

    },

  }
};

module.exports = resolvers;
require('dotenv').config();
const express = require('express');
const {ApolloServerPluginLandingPageLocalDefault} = require('apollo-server-core');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
var cors = require('cors');
const { typeDefs, resolvers, permissions } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
const ImageKit = require('imagekit');
BigInt.prototype.toJSON = function () { return this.toString(); }


const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (err) => {
    // Don't give the specific errors to the client
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
     }
     // Otherwise return the original error
     return err;
  },
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  context: authMiddleware
});

const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const imagekit = new ImageKit({
  urlEndpoint: `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}`,
  publicKey: `${process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY}`,
  privateKey: `${process.env.REACT_APP_IMAGEKIT_PRIVATE_KEY}`
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/auth', function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  console.log(result)
  res.send(result);
});
let fileid = "";
app.post(`/api/:id`, (req, res) => {
  // console.log("Method called is -- ", req.method)
  console.log("Request: " + req.params.id + " Response: " + res)
  imagekit.deleteFile(req.params.id, function(error, result) {
    if(error) console.log(error);
    else console.log(result);
  });
  res.send(req.params.id)
  res.end()
})

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
  // Call the async function to start the server
  startApolloServer(typeDefs, resolvers);


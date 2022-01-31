require("dotenv").config({ path: "config.env" });
// console.log(process.env)
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const path = require('path');
const throttle = require('express-rate-limit');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { translate } = require("./utils/translate");

const PORT = process.env.PORT || 3001;
const app = express();

app.use('/api',require("./routes/speech-to-text-route"));

const limiter = throttle({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// console.log(server)
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}



app.post('/api/translate', limiter, (req, res) => {

  // validation  

  // make sure the user is logged in
  // get the jwt token from req
  // validate it

  // if valid let req pass

  // if not send back err

  // get req body

  // if > 500 char
  // throw an err

  const fromLaaaang = req.body.fromLang;
  const toLang = req.body.toLang;
  const needToTranslate  = req.body.text;

  translate(fromLaaaang, toLang, needToTranslate)
    .then((translated) => {

      res.json(translated)
    })

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});



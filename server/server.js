require("dotenv").config({ path: "config.env" });
// console.log(process.env)
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const path = require("path");
const throttle = require("express-rate-limit");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { translate } = require("./utils/translate");

const PORT = process.env.PORT || 3001;
const app = express();

const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");
const subscriptionKey = process.env.TRANSLATE_SUBSCRIPTION_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com/";
const location = "australiaeast";

app.use("/api", require("./routes/speech-to-text-route"));

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.post("/api/translate", limiter, async (req, res) => {
  // validation

  const username = req.body.username;
  const user = { name: username };
  const acessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json;
  ({ accessToken: accessToken });

  //   'form': {
  //     'token': req.session.accessToken,
  //     'token_type_hint': 'access_token',
  //     'client_id': process.env.OIDC_CLIENT_ID,
  //     'client_secret': process.env.OIDC_CLIENT_SECRET
  //   }
  // },function(err, response, body){
  //   var token = JSON.parse(body);
  //   var tokenValid = false;

  //   var clientIdValid = token.client_id === process.env.OIDC_CLIENT_ID;

  //   console.log(token.client_id)
  //   console.log(process.env.OIDC_CLIENT_ID)
  //   // current time as Unix timestamp
  //   var currentTimestamp = new Date().getTime() / 1000;
  //   var tokenIsNotExpired = token.exp > currentTimestamp;

  //   // sample code to ensure that the required claim is included
  //   // var isAuthorized = token.scope.includes("post:delete")

  //   // uncomment isAuthorized if checking for a specific scope
  //   tokenValid = clientIdValid && tokenIsNotExpired //&& isAuthorized
  // });
  // });

  // make sure the user is logged in
  // get the jwt token from req
  // validate it

  // if valid let req pass

  // if not send back err

  // get req body

  // if > 500 char
  // throw an err

  const fromLang = req.body.fromLang;
  const toLang = req.body.toLang;
  const userText = req.body.userText;

  try {
    const result = await translate(fromLang, toLang, userText);
    res.json(result);
  } catch (e) {
    res.json(e);
  }
});

app.get("/api/get-speech-token", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    res
      .status(400)
      .send("You forgot to add your speech key or region to the .env file.");
  } else {
    const headers = {
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      const tokenResponse = await axios.post(
        `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
        null,
        headers
      );
      res.send({ token: tokenResponse.data, region: speechRegion });
    } catch (err) {
      res.status(401).send("There was an error authorizing your speech key.");
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

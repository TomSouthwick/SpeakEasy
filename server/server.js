require("dotenv").config({ path: "config.env" });
// console.log(process.env)
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { authenticate } = require("./middleware/authenticate");
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

app.post("/api/translate", limiter, authenticate, async (req, res) => {
  // validation

  // get req body

  // if > 500 char
  // throw an err
  const fromLang = req.body.fromLang;
  const toLang = req.body.toLang;
  const userText = req.body.userText;

  if (!userText) {
    return res.status(400).json({ msg: "Please enter some text to translate" });
  }

  if (userText.length > 500) {
    return res
      .status(400)
      .json({
        msg: "Translation is too long! Try translating a shorter phrase",
      });
  }

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

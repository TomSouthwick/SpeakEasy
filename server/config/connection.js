const mongoose = require("mongoose");

console.log(`mongodb+srv://${process.env.MLAB_USER}:${process.env.MLAB_PW}@cluster0.j56u5.mongodb.net/Cluster0?retryWrites=true&w=majority`)
mongoose.connect(
  `mongodb+srv://${process.env.MLAB_USER}:${process.env.MLAB_PW}@cluster0.j56u5.mongodb.net/Cluster0?retryWrites=true&w=majority`,
  // process.env.MONGODB_URI || "mongodb://localhost/tech-friends",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

module.exports = mongoose.connection;

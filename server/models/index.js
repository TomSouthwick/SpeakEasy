const Profile = require('./Profile');

module.exports = { Profile };


// model should include
    // Original phrase
    // translated phrase
    // language to
    // language from
    // number of times that's been hit
        // look up in database if the result has already been hit -- if so add one to the counter for the query
        
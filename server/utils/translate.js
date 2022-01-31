const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

const subscriptionKey = process.env.TRANSLATE_SUBSCRIPTION_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com/";

// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
const location = "australiaeast";

// translate('en', 'fr', 'heloo tom');
function translate(fromLang, toLang, text){

    return axios({
      baseURL: endpoint,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: fromLang,
        to: [toLang],
      },
      data: [
        {
          text: text,
        },
      ],
      responseType: "json",
    }).then(function (response) {
        return response.data;
      // JSON.stringify(response.data, null, 4));
      
    });
}



module.exports = {
    translate
}
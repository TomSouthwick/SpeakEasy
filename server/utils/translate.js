const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

const subscriptionKey = process.env.TRANSLATE_SUBSCRIPTION_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com/";
// Add your location, also known as region. The default is global.
// This is required if using a Cognitive Services resource.
const location = "australiaeast";

// translate('en', 'fr', 'heloo tom');
async function translate(fromLang, toLang, text) {
  const result = await new Promise((res, rej) => {
    axios({
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
    })
      .then(function (response) {
        res(response.data[0].translations[0]);
        // JSON.stringify(response.data, null, 4));
      })
      .catch(function (error) {
        console.error(error.message);
        rej(error);
      });
  });

  return result;
}

// async function upload(file: File){
//   console.log({file});

//   const buffer = await file.arrayBuffer();
//   console.log({buffer});

//   playAudio(buffer);

// }

// function playAudio(arrayBuffer: ArrayBuffer){
//   const audioElement = document.createElement('audio');

//   const blob = new Blob([arrayBuffer], { type: "audio/mp3" });

//   const url = window.URL.createObjectURL(blob);

//   audioElement.src = url;
//   audioElement.play();

// }

// onMounted(() => {
//   const arrayBuffer = [];

// });

// const m = async () => {
//   const result = await translate("en", "fr", "hello")
//   console.log(result[0].translations)

// }
// m()

module.exports = {
  translate,
};

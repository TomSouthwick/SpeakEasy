// require("dotenv").config({ path: "config.env" });
// const express = require('express');

// // async function Output(languageSourceOptions, languageTargetOptions, resultsDiv){

// const subscriptionKey = process.env.SPEECH_KEY;
// const serviceRegion = process.env.SPEECH_REGION;


// // status fields and start button in UI
// const resultsDivs;
// const startRecognizeOnceAsyncButton;

// // subscription key and region for speech services.
// const subscriptionKey, serviceRegion, languageTargetOptions;
// const SpeechSDK;
// const recognizer;

// document.addEventListener("DOMContentLoaded", function () {
//     startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
//     subscriptionKey = document.getElementById("subscriptionKey");
//     serviceRegion = document.getElementById("serviceRegion");
//     languageSourceOptions  = document.getElementById("languageSourceOptions");
//     languageTargetOptions = [
//     document.getElementById("languageTargetOptions1"),
//     document.getElementById("languageTargetOptions2")
//     ];
//     resultsDivs = [
//     document.getElementById("phraseDiv1"),
//     document.getElementById("phraseDiv2")
//     ];

//     startRecognizeOnceAsyncButton.addEventListener("click", function () {
//     startRecognizeOnceAsyncButton.disabled = true;
//     resultsDivs.forEach(function(elem){
//         elem.innerHTML = "";
//     });

//     if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
//         alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
//         startRecognizeOnceAsyncButton.disabled = false;
//         return;
//     }
//     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);

//     speechConfig.speechRecognitionLanguage = languageSourceOptions.value;
//     let languageKeys = {};
//     languageTargetOptions.forEach(function(langElem, index){
//         let language = langElem.value;
//         languageKeys[language] = resultsDivs[index];
//         speechConfig.addTargetLanguage(language);
//     });

//     const audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
//     recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

//     recognizer.recognizeOnceAsync(
//         function (result) {
//         startRecognizeOnceAsyncButton.disabled = false;
//         if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
//             for (const key in languageKeys) {
//             let translation = result.translations.get(key);
//             window.console.log(key + ": " + translation);
//             languageKeys[key].innerHTML += translation;
//             }
//         }

//         recognizer.close();
//         recognizer = undefined;
//         },
//         function (err) {
//         startRecognizeOnceAsyncButton.disabled = false;
//         resultsDiv[0].innerHTML += err;
//         window.console.log(err);

//         recognizer.close();
//         recognizer = undefined;
//         });
//     });

//     if (!!window.SpeechSDK) {
//     SpeechSDK = window.SpeechSDK;
//     startRecognizeOnceAsyncButton.disabled = false;

//     document.getElementById('content').style.display = 'block';
//     document.getElementById('warning').style.display = 'none';
//     }
// });

// // }

// module.exports = {
//    Output
// }

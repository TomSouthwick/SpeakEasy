import { getTokenOrRefresh } from "./token";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Howl, Howler } from "howler";

async function tts2(text) {
  // var sdk = require("microsoft-cognitiveservices-speech-sdk");
  // var readline = require("readline");

  var key = "YourSubscriptionKey";
  var region = "YourServiceRegion";
  var audioFile = "YourAudioFile.wav";

  const tokenObj = await getTokenOrRefresh();
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    tokenObj.authToken,
    tokenObj.region
  );

  // const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioUrl);

  // The language of the voice that speaks.
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // Create the speech synthesizer.
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  synthesizer.speakTextAsync(
    text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error(
          "Speech synthesis canceled, " +
            result.errorDetails +
            "\nDid you update the subscription info?"
        );
      }
      synthesizer.close();
      synthesizer = null;
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null;
    }
  );
}

const activateTextToSpeech = async (languageTo, sourceTranslation) => {
  const tokenObj = await getTokenOrRefresh();
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    tokenObj.authToken,
    tokenObj.region
  );
  // speechConfig.speechSynthesisLanguage = "en-US"; // For example, "de-DE"
  speechConfig.speechSynthesisLanguage = languageTo; // For example, "de-DE"

  //tts2(sourceTranslation);
  const dest = new sdk.SpeakerAudioDestination("aaa");
  dest.onAudioEnd = function () {
    console.log("audioEnd");
  };
  const audioConfig = sdk.AudioConfig.fromSpeakerOutput(dest);
  //const audioConfig = sdk.AudioConfig.fromSpeakerOutput();

  console.log({ audioConfig });

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  let done = false;
  synthesizer.synthesisCompleted = function (s, e) {
    if (!done) {
      console.log(s);
      console.log(e);
    }
  };

  synthesizer.speakTextAsync(
    sourceTranslation,
    (result) => {
      console.log("this is raw", result);
      // const player = new sdk.BaseAudioPlayer();
      // player.playAudioSample(result.audioData);

      const data = result.privAudioData;

      const audioElement = document.getElementById("speakup-mate");

      const blob = new Blob([result.audioData], { type: "audio/mp3" });

      const url = window.URL.createObjectURL(blob);

      const sound = new Howl({
        src: [url],
      });
      console.log("howler");
      // sound.play();

      audioElement.src = url;
      // audioElement.controls = true;

      console.log("audio is ", audioElement);

      // we want to run play() only on ios

      function iOS() {
        return (
          [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
          ].includes(navigator.platform) ||
          // iPad on iOS 13 detection
          (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        );
      }
      console.log("playinggggg");
      // audioElement.play();
      // if (iOS()) {
      //}

      // document.body.append(audioElement);

      // MSE will block you when you tried to automate media playing
      // click translate
      // get the array buffer

      // create an audio element
      // replace with eht blue speaker icon

      //       audioElement.play();

      // const audio = new AudioContext();

      // audio.decodeAudioData(data, (decoded) => {
      //   console.log(decoded);

      //   const source = audio.createBufferSource();
      //   source.buffer = decoded;

      //   source.connect(audio.destination);
      //   source.start();
      // });

      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        done = true;
        console.log("synthesis finished.");
      } else {
        console.error(
          "Speech synthesis canceled, " +
            result.errorDetails +
            "\nDid you update the subscription info?"
        );
      }
    },
    (error) => {
      console.log(error);

      synthesizer.close();
    }
  );
};

export { activateTextToSpeech };

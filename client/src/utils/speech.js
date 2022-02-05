import { getTokenOrRefresh } from "./token";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const activateTextToSpeech = async (languageTo, sourceTranslation) => {
  const tokenObj = await getTokenOrRefresh();
  const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
    tokenObj.authToken,
    tokenObj.region
  );
  // speechConfig.speechSynthesisLanguage = "en-US"; // For example, "de-DE"
  speechConfig.speechSynthesisLanguage = languageTo; // For example, "de-DE"
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  synthesizer.speakTextAsync(
    sourceTranslation,
    (result) => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
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

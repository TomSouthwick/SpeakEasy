import React, { useState } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton, { iconButtonClasses } from "@mui/material/IconButton";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// const Output = (e) => {

//     startRecognizeOnceAsyncButton.disabled = false;
//     if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
//         for (const key in languageKeys) {
//         let translation = result.translations.get(key);
//         window.console.log(key + ": " + translation);
//         languageKeys[key].innerHTML += translation;
//         }
//     }

//     recognizer.close();
//     recognizer = undefined;
// }

const Translator = () => {
  /* useEffect(() => {
    const speechConfigToSet = sdk.SpeechConfig.fromSubscription(
      "568967eff238487d99675a938c17f9bd",
      "australiaeast"
    );
    setSpeechConfig(speechConfigToSet);
  }, []); */

  const activateTranslate = () => {
    console.log(languageFrom, languageTo, userText);
    axios
      .post("/api/translate/", {
        fromLang: languageFrom,
        toLang: languageTo,
        userText: userText,
      })
      .then(function (response) {
        console.log(response);
        setTranslationOutput(response.data.text);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sttFromMic = async() => {
    // const tokenObj = await getTokenOrRefresh();
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      "568967eff238487d99675a938c17f9bd",
      "australiaeast")
    speechConfig.speechRecognitionLanguage = 'en-US';
    
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    translatedSpeech({
        displayText: 'speak into your microphone...'
    });

    recognizer.recognizeOnceAsync(result => {
        let displayText;
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            displayText = `RECOGNIZED: Text=${result.text}`
        } else {
            displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        }

        translatedSpeech({
            displayText: displayText
        });
    });
  }
 



  // const activateSpeechToText = () => {
  //   const speechConfig = sdk.SpeechConfig.fromSubscription("568967eff238487d99675a938c17f9bd", "australiaeast");
  //   speechConfig.speechRecognitionLanguage = languageFrom; // For example, "de-DE"
  //   const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    
  //   const recognizer = new sdk.TranslationRecognizer(speechConfig, audioConfig);
  //   recognizer.recognizeOnceAsync(
  //     TextField,
  //     (result) => {
  //       if (result.reason === sdk.ResultReason.TranslatedSpeech) {
  //         console.log("translation finished.");
  //       } else {
  //         console.error(
  //           "Speech translation canceled, " +
  //             result.errorDetails +
  //             "\nDid you update the subscription info?"
  //         );
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       recognizer.close();
  //     }
  //   )  
  // };

  const activateTextToSpeech = () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      "568967eff238487d99675a938c17f9bd",
      "australiaeast"
    );
    // speechConfig.speechSynthesisLanguage = "en-US"; // For example, "de-DE"
    speechConfig.speechSynthesisLanguage = languageTo; // For example, "de-DE"
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync( 
      translationOutput,
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
  const [speechConfig, setSpeechConfig] = useState();
  const [languageFrom, setLanguageFrom] = useState("en");
  const [languageTo, setLanguageTo] = useState("fr");
  const [userText, setUserText] = useState("I will detect your, language");
  const [translationOutput, setTranslationOutput] = useState("");
  const [translatedSpeech] = useState("");
  const languages = [{"label":"Afrikaans (South Africa)","languagecode":"af-ZA"},{"label":"Amharic (Ethiopia)","languagecode":"am-ET"},{"label":"Arabic (Algeria)","languagecode":"ar-DZ"},{"label":"Arabic (Bahrain)","languagecode":"ar-BH"},{"label":"Arabic (Egypt)","languagecode":"ar-EG"},{"label":"Arabic (Iraq)","languagecode":"ar-IQ"},{"label":"Arabic (Jordan)","languagecode":"ar-JO"},{"label":"Arabic (Kuwait)","languagecode":"ar-KW"},{"label":"Arabic (Libya)","languagecode":"ar-LY"},{"label":"Arabic (Morocco)","languagecode":"ar-MA"},{"label":"Arabic (Qatar)","languagecode":"ar-QA"},{"label":"Arabic (Saudi Arabia)","languagecode":"ar-SA"},{"label":"Arabic (Syria)","languagecode":"ar-SY"},{"label":"Arabic (Tunisia)","languagecode":"ar-TN"},{"label":"Arabic (United Arab Emirates)","languagecode":"ar-AE"},{"label":"Arabic (Yemen)","languagecode":"ar-YE"},{"label":"Bangla (Bangladesh)","languagecode":"bn-BD"},{"label":"Bengali (India)","languagecode":"bn-IN"},{"label":"Bulgarian (Bulgaria)","languagecode":"bg-BG"},{"label":"Burmese (Myanmar)","languagecode":"my-MM"},{"label":"Catalan (Spain)","languagecode":"ca-ES"},{"label":"Chinese (Cantonese, Traditional)","languagecode":"zh-HK"},{"label":"Chinese (Mandarin, Simplified)","languagecode":"zh-CN"},{"label":"Chinese (Taiwanese Mandarin)","languagecode":"zh-TW"},{"label":"Croatian (Croatia)","languagecode":"hr-HR"},{"label":"Czech (Czech)","languagecode":"cs-CZ"},{"label":"Danish (Denmark)","languagecode":"da-DK"},{"label":"Dutch (Belgium)","languagecode":"nl-BE"},{"label":"Dutch (Netherlands)","languagecode":"nl-NL"},{"label":"English (Australia)","languagecode":"en-AU"},{"label":"English (Canada)","languagecode":"en-CA"},{"label":"English (Hongkong)","languagecode":"en-HK"},{"label":"English (India)","languagecode":"en-IN"},{"label":"English (Ireland)","languagecode":"en-IE"},{"label":"English (Kenya)","languagecode":"en-KE"},{"label":"English (New Zealand)","languagecode":"en-NZ"},{"label":"English (Nigeria)","languagecode":"en-NG"},{"label":"English (Philippines)","languagecode":"en-PH"},{"label":"English (Singapore)","languagecode":"en-SG"},{"label":"English (South Africa)","languagecode":"en-ZA"},{"label":"English (Tanzania)","languagecode":"en-TZ"},{"label":"English (United Kingdom)","languagecode":"en-GB"},{"label":"English (United States)","languagecode":"en-US"},{"label":"Estonian (Estonia)","languagecode":"et-EE"},{"label":"Finnish (Finland)","languagecode":"fi-FI"},{"label":"French (Belgium)","languagecode":"fr-BE"},{"label":"French (Canada)","languagecode":"fr-CA"},{"label":"French (France)","languagecode":"fr-FR"},{"label":"French (Switzerland)","languagecode":"fr-CH"},{"label":"Galician (Spain)","languagecode":"gl-ES"},{"label":"German (Austria)","languagecode":"de-AT"},{"label":"German (Germany)","languagecode":"de-DE"},{"label":"German (Switzerland)","languagecode":"de-CH"},{"label":"Greek (Greece)","languagecode":"el-GR"},{"label":"Gujarati (India)","languagecode":"gu-IN"},{"label":"Hebrew (Israel)","languagecode":"he-IL"},{"label":"Hindi (India)","languagecode":"hi-IN"},{"label":"Hungarian (Hungary)","languagecode":"hu-HU"},{"label":"Icelandic (Iceland)","languagecode":"is-IS"},{"label":"Indonesian (Indonesia)","languagecode":"id-ID"},{"label":"Irish (Ireland)","languagecode":"ga-IE"},{"label":"Italian (Italy)","languagecode":"it-IT"},{"label":"Japanese (Japan)","languagecode":"ja-JP"},{"label":"Javanese (Indonesia)","languagecode":"jv-ID"},{"label":"Kannada (India)","languagecode":"kn-IN"},{"label":"Kazakh (Kazakhstan)","languagecode":"kk-KZ"},{"label":"Khmer (Cambodia)","languagecode":"km-KH"},{"label":"Korean (Korea)","languagecode":"ko-KR"},{"label":"Lao (Laos)","languagecode":"lo-LA"},{"label":"Latvian (Latvia)","languagecode":"lv-LV"},{"label":"Lithuanian (Lithuania)","languagecode":"lt-LT"},{"label":"Macedonian (Republic of North Macedonia)","languagecode":"mk-MK"},{"label":"Malay (Malaysia)","languagecode":"ms-MY"},{"label":"Malayalam (India)","languagecode":"ml-IN"},{"label":"Maltese (Malta)","languagecode":"mt-MT"},{"label":"Marathi (India)","languagecode":"mr-IN"},{"label":"Norwegian (Bokmål, Norway)","languagecode":"nb-NO"},{"label":"Pashto (Afghanistan)","languagecode":"ps-AF"},{"label":"Persian (Iran)","languagecode":"fa-IR"},{"label":"Polish (Poland)","languagecode":"pl-PL"},{"label":"Portuguese (Brazil)","languagecode":"pt-BR"},{"label":"Portuguese (Portugal)","languagecode":"pt-PT"},{"label":"Romanian (Romania)","languagecode":"ro-RO"},{"label":"Russian (Russia)","languagecode":"ru-RU"},{"label":"Serbian (Serbia, Cyrillic)","languagecode":"sr-RS"},{"label":"Sinhala (Sri Lanka)","languagecode":"si-LK"},{"label":"Slovak (Slovakia)","languagecode":"sk-SK"},{"label":"Slovenian (Slovenia)","languagecode":"sl-SI"},{"label":"Somali (Somalia)","languagecode":"so-SO"},{"label":"Spanish (Argentina)","languagecode":"es-AR"},{"label":"Spanish (Bolivia)","languagecode":"es-BO"},{"label":"Spanish (Chile)","languagecode":"es-CL"},{"label":"Spanish (Colombia)","languagecode":"es-CO"},{"label":"Spanish (Costa Rica)","languagecode":"es-CR"},{"label":"Spanish (Cuba)","languagecode":"es-CU"},{"label":"Spanish (Dominican Republic)","languagecode":"es-DO"},{"label":"Spanish (Ecuador)","languagecode":"es-EC"},{"label":"Spanish (El Salvador)","languagecode":"es-SV"},{"label":"Spanish (Equatorial Guinea)","languagecode":"es-GQ"},{"label":"Spanish (Guatemala)","languagecode":"es-GT"},{"label":"Spanish (Honduras)","languagecode":"es-HN"},{"label":"Spanish (Mexico)","languagecode":"es-MX"},{"label":"Spanish (Nicaragua)","languagecode":"es-NI"},{"label":"Spanish (Panama)","languagecode":"es-PA"},{"label":"Spanish (Paraguay)","languagecode":"es-PY"},{"label":"Spanish (Peru)","languagecode":"es-PE"},{"label":"Spanish (Puerto Rico)","languagecode":"es-PR"},{"label":"Spanish (Spain)","languagecode":"es-ES"},{"label":"Spanish (Uruguay)","languagecode":"es-UY"},{"label":"Spanish (US)","languagecode":"es-US"},{"label":"Spanish (Venezuela)","languagecode":"es-VE"},{"label":"Sundanese (Indonesia)","languagecode":"su-ID"},{"label":"Swahili (Kenya)","languagecode":"sw-KE"},{"label":"Swahili (Tanzania)","languagecode":"sw-TZ"},{"label":"Swedish (Sweden)","languagecode":"sv-SE"},{"label":"Tamil (India)","languagecode":"ta-IN"},{"label":"Tamil (Singapore)","languagecode":"ta-SG"},{"label":"Tamil (Sri Lanka)","languagecode":"ta-LK"},{"label":"Telugu (India)","languagecode":"te-IN"},{"label":"Thai (Thailand)","languagecode":"th-TH"},{"label":"Turkish (Turkey)","languagecode":"tr-TR"},{"label":"Ukrainian (Ukraine)","languagecode":"uk-UA"},{"label":"Urdu (India)","languagecode":"ur-IN"},{"label":"Urdu (Pakistan)","languagecode":"ur-PK"},{"label":"Uzbek (Uzbekistan)","languagecode":"uz-UZ"},{"label":"Vietnamese (Vietnam)","languagecode":"vi-VN"},{"label":"Welsh (United Kingdom)","languagecode":"cy-GB"},{"label":"Zulu (South Africa)","languagecode":"zu-ZA"}]

  // import { useState } from 'react';
  // export const useForm = (callback, initialState = {}) => {
  //   const [values, setValues] = useState(initialState);
  //   const onChange = (event) => {
  //       setValues({ ...values, [event.target.name]: event.target.values })
  //   }
  //   const onSubmit = event => {
  //       event.preventDefault();
  //       callback();
  //   }
  //   return {
  //       onChange,
  //       onSubmit,
  //       values
  //   }
  // }


  return (
    <div>
      <MicIcon fontSize="large" />
      <Box
        id="phraseDiv"
        component="span"
        sx={{
          display: "block",
          p: 1,
          m: 1,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#101010" : "#fff",
          color: (theme) =>
            theme.palette.mode === "dark" ? "grey.300" : "grey.800",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.300",
          borderRadius: 2,
          fontSize: "0.875rem",
          fontWeight: "700",
        }}
      >
        {translationOutput}
      </Box>
      <div>
      {translatedSpeech}
      </div>
      
      <iconButton>
        <VolumeUpIcon
          id="startSpeakTextAsyncButton"
          color="primary"
          fontSize="large"
        />
      </iconButton>

      <TextField
        id="filled-multiline-static"
        label="Input field"
        multiline
        rows={4}
        defaultValue="I will detect your, language"
        variant="filled"
        onChange={(activateSpeechToText) => {
          setUserText(activateSpeechToText.target.value);
        }}
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        placeholder="English"

        options={languages}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Language" />}
        onChange={(event, newValue) => {
          setLanguageFrom(newValue.languagecode);
        }}
      />
      <Autocomplete
        disablePortal
        placeholder="French"
        id="combo-box-demo"
        options={languages}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Language" />}
        onChange={(event, newValue) => {
          setLanguageTo(newValue.languagecode);
        }}
      />
      <Button onClick={activateTranslate} variant="contained">
        Translate
      </Button>

      {translationOutput.length > 0 && (<Button onClick={activateTextToSpeech} variant="contained">
        Text to Speech
      </Button>)}

      <Button onClick={sttFromMic} variant="contained">
        Speech to text
      </Button>
    </div>
  );
};


export default Translator;

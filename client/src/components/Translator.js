import React, { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton, { IconButtonClasses } from "@mui/material/IconButton";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { languages } from "../utils/language-code";
import { activateTextToSpeech } from "../utils/speech";

import { ADD_INPUT_PHRASE, REMOVE_ALL_TRANSLATIONS } from "../utils/mutations";
import { ADD_TRANSLATED_PHRASE } from "../utils/mutations";
import { QUERY_SINGLE_PROFILE } from "../utils/queries";

import Auth from "../utils/auth";
import { getTokenOrRefresh } from "../utils/token";

const Translator = () => {
  const [addInputPhrase, { error: inputPhraseError }] =
    useMutation(ADD_INPUT_PHRASE);
  const [addTranslatedPhrase, { error: translatedPhraseError }] = useMutation(
    ADD_TRANSLATED_PHRASE
  );
  const [removeAllTranslations, { error: removeAllTranslationsError }] =
    useMutation(REMOVE_ALL_TRANSLATIONS);

  const profileQuery = useQuery(QUERY_SINGLE_PROFILE, {
    variables: { profileId: Auth.getProfile().data._id },
  });

  const activateTranslate = async (inputText) => {
    console.log(languageFrom, languageTo);

    const profileId = Auth.getProfile().data._id;
    const data = await addInputPhrase({
      variables: { profileId, inputPhrase: inputText },
    });
    // addInputPhrase(inputText)

    axios
      .post("/api/translate/", {
        fromLang: languageFrom,
        toLang: languageTo,
        userText: inputText,
      })
      .then(async function (response) {
        console.log(response);

        const translated = response.data.text + "@@" + languageTo;
        const translatedData = await addTranslatedPhrase({
          variables: { profileId, translatedPhrase: translated },
        });
        // store the translated text to db
        setTranslationOutput(response.data.text);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sttFromMic = async (test) => {
    console.log(test);
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = languageFrom;
    let state = "";
    state = "INITIALIZED: ready to test speech...";

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    state = "speak into your microphone...";

    recognizer.recognizeOnceAsync((result) => {
      // setTimeout(() => {
      //   activateTranslate()
      // }, 0)

      let displayText;
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
        setUserText(result.text);
        setTimeout(() => {
          activateTranslate(result.text);
        }, 0);
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      console.log(result.text);
      console.log(displayText);
      // state = displayText
      return result;
    });
  };

  const clearAll = async () => {
    // let
    const clearPhrases = await removeAllTranslations({
      variables: { profileId: Auth.getProfile().data._id },
    });
    profileQuery.refetch();
  };
  const [clearTranslations, setClearTranslations] = useState("");
  const [languageFrom, setLanguageFrom] = useState("en-US");
  const [languageTo, setLanguageTo] = useState("fr-FR");
  const [userText, setUserText] = useState("Hello World - Translate me");
  const [translationOutput, setTranslationOutput] = useState("");
  const [translatedSpeech] = useState("");

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
        contrastText: "white",
      },
    },
  });

  const MyThemeComponent = styled("div")(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  }));

  return (
    <div>
      <Box
        id="phraseDiv"
        component="span"
        minHeight="30px"
        // defaultValue="Translated text..."
        // fontColor="black"
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
      <div>{translatedSpeech}</div>
      <ThemeProvider theme={customTheme}>
        <MyThemeComponent>{translationOutput}</MyThemeComponent>
      </ThemeProvider>
      <IconButton>
        <VolumeUpIcon
          id="startSpeakTextAsyncButton"
          color="primary"
          fontSize="large"
          onClick={() => activateTextToSpeech(languageTo, translationOutput)}
        />
      </IconButton>
      <TextField
        id="filled-multiline-static"
        // label="Text to be translated"
        multiline
        rows={4}
        defaultValue={userText}
        variant="filled"
        value={userText}
        onChange={(event) => {
          setUserText(event.target.value);
          //call the api response = apirCAll()
          // setTranslationOutput(response)
        }}
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        placeholder="English"
        defaultValue={{ label: "English" }}
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
        defaultValue={{ label: "French" }}
        renderInput={(params) => <TextField {...params} label="Language" />}
        onChange={(event, newValue) => {
          setLanguageTo(newValue.languagecode);
        }}
      />
      <Button onClick={() => activateTranslate(userText)} variant="contained">
        Translate
      </Button>
      {/* {translationOutput.length > 0 && (<Button onClick={activateTextToSpeech} variant="contained">
        Text to Speech
      </Button>)} */}
      <IconButton>
        <MicIcon fontSize="large" onClick={sttFromMic} color="primary" />
      </IconButton>
      {/* <Button onClick={sttFromMic} variant="contained">
        Speech to text
      </Button> */}
      <Button onClick={() => clearAll(userText)} variant="contained">
        Clear
      </Button>
      {!profileQuery.loading &&
        profileQuery?.data?.profile?.inputPhrases.map((phrase) => {
          return <div> {phrase} </div>;
        })}

      {!profileQuery.loading &&
        profileQuery?.data?.profile?.translatedPhrases.map((phrase) => {
          const splitted = phrase.split("@@");
          const translation = splitted[0];
          const lang = splitted[1];
          return (
            <div onClick={() => activateTextToSpeech(lang, translation)}>
              {translation}
            </div>
          );
        })}
    </div>
  );
};

export default Translator;

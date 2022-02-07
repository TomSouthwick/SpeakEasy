import React, { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton, { IconButtonClasses } from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useHistory, useLocation } from "react-router-dom";

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

  const history = useHistory();
  // is user is not authenticated, redirect to /login
  

  const activateTranslate = async (inputText) => {
    if (!Auth.loggedIn()) {
      history.push("/login");
      return
    }
    console.log(languageFrom, languageTo, Auth.getToken());

    // const auth = getToken() {
    //   return localStorage.getItem("id_token");
    // }
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
        token: Auth.getToken(),
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

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

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
  const [userText, setUserText] = useState("Hello World. Translate me");
  const [translationOutput, setTranslationOutput] = useState(
    "Salut tout le monde. Traduisez-moi"
  );

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

  const style = {
    width: "100%",
    maxWidth: 360,
    bgcolor: "background.paper",
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id="filled-multiline-static"
              // label="Text to be translated"
              style={{ width: "100%" }}
              multiline
              rows={4}
              defaultValue={userText}
              variant="filled"
              value={userText}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton sx={{    marginTop: "-65px"}}>
                      <MicIcon
                        fontSize="large"
                        onClick={sttFromMic}
                        color="primary"
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                setUserText(event.target.value);
                //call the api response = apirCAll()
                // setTranslationOutput(response)
              }}
            ></TextField>

            <Autocomplete
              disablePortal
              disableClearable
              id="combo-box-demo"
              placeholder="English"
              defaultValue={{ label: "English" }}
              options={languages}
              sx={{ width: "100%", marginTop: "20px" }}
              renderInput={(params) => (
                <TextField {...params} label="Language" />
              )}
              onChange={(event, newValue) => {
                setLanguageFrom(newValue.languagecode);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "block",
                padding: "10px",
                paddingTop: "27px",
                paddingRight: "40px",
                minHeight: "125px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#101010" : "#fff",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "grey.300" : "grey.800",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "560",
              }}
            >
              <Box
                id="phraseDiv"
                component="span"
                minHeight="30px"
                sx={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
                // defaultValue="Translated text..."
                // fontColor="black"
              >
                <div>
                {translationOutput}
                </div>
                <div style={{marginTop: "-15px"}}>
                <IconButton>
                  <VolumeUpIcon
                   
                    id="startSpeakTextAsyncButton"
                    color="primary"
                    fontSize="large"
                    onClick={() =>
                      activateTextToSpeech(languageTo, translationOutput)
                    }
                  />
                </IconButton>
                </div>
                

              </Box>
            </Box>
            <Autocomplete
              disablePortal
              disableClearable
              placeholder="French"
              id="combo-box-demo"
              options={languages}
              sx={{ width: "100%", marginTop: "20px" }}
              defaultValue={{ label: "French" }}
              renderInput={(params) => (
                <TextField {...params} label="Language" />
              )}
              onChange={(event, newValue) => {
                setLanguageTo(newValue.languagecode);
              }}
            />
          </Grid>
          
        </Grid>
      </Box>

      <div style={{textAlign: "center"}}>     
        <Button style={{marginTop: "10px", marginBottom: "20px"}} onClick={() => activateTranslate(userText)} variant="contained">
          Translate
        </Button>
      </div>

      <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
                {!profileQuery.loading &&
              profileQuery?.data?.profile?.inputPhrases.map((phrase) => {
                return (
                  <List sx={style} component="nav" aria-label="mailbox folders">
                    <ListItem
                      button
                      onClick={() => {
                        navigator.clipboard.writeText(phrase);
                      }}
                    > 
                      <ListItemText primary={phrase} /><ContentCopyIcon></ContentCopyIcon>
                    </ListItem>
                    <Divider />
                  </List>
                );
              })}
          </Grid>
          <Grid item xs={12} md={6}>

          {!profileQuery.loading &&
        profileQuery?.data?.profile?.translatedPhrases.map((phrase) => {
          const splitted = phrase.split("@@");
          const translation = splitted[0];
          const lang = splitted[1];
          return (
            <List sx={style} component="nav" aria-label="mailbox folders">
              <ListItem button onClick={() => activateTextToSpeech(lang, translation)}>
                <ListItemText
                  primary={translation}
                /><VolumeUpIcon></VolumeUpIcon>
              </ListItem>
              <Divider />
            </List>
          );
        })}
          </Grid>
      </Grid>


      {(profileQuery?.data?.profile?.translatedPhrases.length > 0 && <div style={{textAlign: "center", marginTop: "10px"}}><Button onClick={() => clearAll(userText)} variant="contained">
          Clear History
      </Button></div>)}
      

      
    </div>
  );
};

export default Translator;

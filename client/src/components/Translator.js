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
import ListItemButton from "@mui/material/ListItemButton";
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
      return;
    }
    // console.log(languageFrom, languageTo, Auth.getToken());

    // const auth = getToken() {
    //   return localStorage.getItem("id_token");
    // }
    const profileId = Auth.getProfile().data._id;
    const data = await addInputPhrase({
      variables: { profileId, inputPhrase: inputText },
    });
    setRecentlyTranslatedLanguage(languageTo);
    // addInputPhrase(inputText)

    return axios
      .post("/api/translate/", {
        fromLang: languageFrom,
        toLang: languageTo,
        userText: inputText,
        token: Auth.getToken(),
      })
      .then(async function (response) {
        console.log(response);

        const translated =
          response.data.text + "@@" + languageTo + "@@" + inputText;
        const translatedData = await addTranslatedPhrase({
          variables: { profileId, translatedPhrase: translated },
        });
        // store the translated text to db
        setTranslationOutput(response.data.text);

        return {
          translated: response.data.text,
          languageTo,
        };
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const convertLanguageToObj = (langArr) => {
    const obj = {};
    langArr.forEach((d) => {
      console.log(d);
      const splitted = d.split("@@");
      console.log(splitted);

      const lang = splitted[1];
      const outputPhrase = splitted[0];
      const inputPhrase = splitted[2];

      if (obj[lang]) {
        obj[lang].push([outputPhrase, inputPhrase]);
      } else {
        obj[lang] = [[outputPhrase, inputPhrase]];
      }
    });
    return obj;
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

  async function speakUpMate(userText) {
    const { translated, languageTo } = await activateTranslate(userText);
    await activateTextToSpeech(languageTo, translated);
  }

  const [selectedHistory, setSelectedHistory] = useState(null);

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

  const [hoveredPhrase, setHoveredPhrase] = useState("deez");

  const [recentlyTranslatedLanguage, setRecentlyTranslatedLanguage] =
    useState("");

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
                    <IconButton sx={{ marginTop: "-65px" }}>
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
                maxHeight: "125px",
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
              style={{ overflow: "hidden", overflow: "overlay" }}
            >
              <Box
                id="phraseDiv"
                component="span"
                minHeight="30px"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                // defaultValue="Translated text..."
                // fontColor="black"
              >
                <div>{translationOutput}</div>
                <div
                  style={{
                    marginTop: "-15px",
                  }}
                >
                  {/* Wrap inside an audio-tag */}
                  <audio id="speakup-mate"></audio>
                  <IconButton>
                    <VolumeUpIcon
                      id="startSpeakTextAsyncButton"
                      color="primary"
                      fontSize="large"
                      onClick={
                        () => {
                          document.getElementById("speakup-mate").play();
                        }
                        // activateTextToSpeech(languageTo, translationOutput)
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

      <div style={{ textAlign: "center" }}>
        <Button
          style={{ marginTop: "10px", marginBottom: "20px" }}
          onClick={() => speakUpMate(userText)}
          variant="contained"
        >
          Translate
        </Button>
      </div>

      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          className="hide-on-mobile"
        >
          {!profileQuery.loading &&
            profileQuery?.data?.profile?.inputPhrases.map((phrase) => {
              return (
                <List sx={style} component="nav" aria-label="mailbox folders">
                  <ListItem
                    style={{
                      background:
                        hoveredPhrase === phrase ? "rgb(240 240 240)" : "white",
                      borderRadius: "8px",
                    }}
                    button
                    onMouseEnter={() => setHoveredPhrase(phrase)}
                    onMouseLeave={() => setHoveredPhrase("")}
                    onClick={() => {
                      navigator.clipboard.writeText(phrase);
                    }}
                  >
                    <ListItemText primary={phrase} />
                    <ContentCopyIcon></ContentCopyIcon>
                  </ListItem>
                  <Divider />
                </List>
              );
            })}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {!profileQuery.loading &&
            profileQuery?.data?.profile?.translatedPhrases &&
            Object.entries(
              convertLanguageToObj(
                profileQuery?.data?.profile?.translatedPhrases
              )
            )
              .sort((l) => (l[0] !== recentlyTranslatedLanguage ? -1 : 0))
              .map(([lang, phrases]) => {
                return (
                  <div
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontWeight: "560",
                      color: "#424242",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        paddingRight: "5px",
                        paddingTop: "5px",
                      }}
                    >
                      <span>{lang}</span>
                    </div>
                    {phrases.reverse().map((phrase, index) => {
                      // const splitted = phrase.split("@@");
                      // const translation = splitted[0];
                      // const lang = splitted[1];
                      return (
                        <List
                          sx={style}
                          component="nav"
                          aria-label="mailbox folders"
                          onMouseEnter={() => setHoveredPhrase(phrase[1])}
                          onMouseLeave={() => setHoveredPhrase("")}
                          style={{
                            background:
                              hoveredPhrase === phrase[1]
                                ? "rgb(240 240 240)"
                                : "white",
                            borderRadius: "8px",
                          }}
                        >
                          <ListItem
                            className="hide-on-desktop"
                            // style={{ display: "block" }}
                            onClick={() => {
                              navigator.clipboard.writeText(phrase[1]);
                            }}
                          >
                            <ListItemText>{phrase[1]}</ListItemText>
                            <ContentCopyIcon></ContentCopyIcon>
                          </ListItem>

                          <ListItem>
                            <ListItemText primary={phrase[0]} />
                            {selectedHistory === index && iOS() && (
                              <IconButton
                                onClick={() => {
                                  const audio =
                                    document.getElementById("speakup-mate");
                                  audio.play();
                                }}
                              >
                                <VolumeUpIcon color="primary"></VolumeUpIcon>
                              </IconButton>
                            )}
                            {(selectedHistory !== index || !iOS()) && (
                              <Button
                                onClick={async () => {
                                  setSelectedHistory(index);
                                  const audio =
                                    document.getElementById("speakup-mate");
                                  audio.src = "";
                                  await activateTextToSpeech(lang, phrase[0]);
                                  console.log("black btnn");
                                }}
                              >
                                {iOS() ? (
                                  "Audio"
                                ) : (
                                  <VolumeUpIcon color="primary"></VolumeUpIcon>
                                )}
                              </Button>
                            )}
                          </ListItem>
                          <Divider />
                        </List>
                      );
                    })}
                  </div>
                );
              })}

          {/* {!profileQuery.loading &&
            profileQuery?.data?.profile?.translatedPhrases.map(
              (phrase, index) => {
                const splitted = phrase.split("@@");
                const translation = splitted[0];
                const lang = splitted[1];
                return (
                  <List sx={style} component="nav" aria-label="mailbox folders">
                    <ListItemButton selected={selectedHistory === index} button>
                      <ListItemText primary={translation} />
                      {selectedHistory === index && iOS() && (
                        <IconButton
                          onClick={() => {
                            const audio =
                              document.getElementById("speakup-mate");
                            audio.play();
                          }}
                        >
                          <VolumeUpIcon color="primary"></VolumeUpIcon>
                        </IconButton>
                      )}
                      {(selectedHistory !== index || !iOS()) && (
                        <Button
                          onClick={async () => {
                            setSelectedHistory(index);
                            const audio =
                              document.getElementById("speakup-mate");
                            audio.src = "";
                            await activateTextToSpeech(lang, translation);
                            console.log("black btnn");
                          }}
                        >
                          {iOS() ? (
                            "Tap To Load"
                          ) : (
                            <VolumeUpIcon color="primary"></VolumeUpIcon>
                          )}
                        </Button>
                      )}
                    </ListItemButton>
                    <Divider />
                  </List>
                );
              }
            )} */}
        </Grid>
      </Grid>

      {profileQuery?.data?.profile?.translatedPhrases.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button onClick={() => clearAll(userText)} variant="contained">
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
};

export default Translator;

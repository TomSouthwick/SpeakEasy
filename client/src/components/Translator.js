import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const Translator = () => {
    const activateTranslate = () => {
        console.log(languageFrom, languageTo, userText)
    }
    const [languageFrom, setLanguageFrom] = useState();
    const [languageTo, setLanguageTo] = useState();
    const [userText, setUserText] = useState("");
    const languages = [
        { label: 'English', languagecode: 'en' },
        { label: 'French', languagecode: 'fr' },
       
    ];
  return (
    <div>
        <TextField
            id="filled-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            defaultValue="Default Value"
            variant="filled"
            onChange={(event) => {
                setUserText(event.target.value);
              }}
        />
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={languages}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Language" />}
            onChange={(event, newValue) => {
                setLanguageFrom(newValue.languagecode);
              }}
        />
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={languages}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Language" />}
            onChange={(event, newValue) => {
                setLanguageTo(newValue.languagecode);
              }}
        />
         <Button onClick={activateTranslate}
          variant="contained">Translate</Button>
    </div>
  );
};

export default Translator;

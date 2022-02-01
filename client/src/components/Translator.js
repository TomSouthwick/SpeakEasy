import React, { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const Translator = () => {
    const activateTranslate = () => {
        console.log(languageFrom, languageTo, userText)
        axios.post('/api/translate/', {
          fromLang: languageFrom,
           toLang: languageTo,
           userText: userText
        })
        .then(function (response) {
          console.log(response);
          setTranslationOutput(response.data.text)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    const [languageFrom, setLanguageFrom] = useState();
    const [languageTo, setLanguageTo] = useState();
    const [userText, setUserText] = useState("");
    const [translationOutput, setTranslationOutput] = useState("");
    const languages = [
      { label: 'Afrikaans', languagecode: 'af'},
      { label: 'Albanian', languagecode:	'sq'},
      { label: 'Amharic', languagecode:	'am'},
      { label: 'Arabic', languagecode:	'ar'},
      { label: 'Armenian', languagecode:	'hy'},
      { label: 'Assamese', languagecode:	'as'},
      { label: 'Azerbaijani', languagecode:	'az'},
      { label: 'Bangla', languagecode:	'bn'},
      { label: 'Bashkir', languagecode:	'ba'},
      { label: 'Bosnian (Latin)', languagecode:	'bs'},
      { label: 'Bulgarian', languagecode:	'bg'},
      { label: 'Cantonese (Traditional)', languagecode:'yue'},			
      { label: 'Catalan', languagecode:	'ca'},
      { label: 'Chinese (Literary)',	languagecode: 'lzh'},
      { label: 'Chinese Simplified', languagecode:'zh-Hans'},		
      { label: 'Chinese Traditional', languagecode:'zh-Hant'},			
      { label: 'Croatian', languagecode:	'hr'},
      { label: 'Czech', languagecode:	'cs'},
      { label: 'Danish', languagecode:	'da'},
      { label: 'Dari'	, languagecode: 'prs'},
      { label: 'Divehi', languagecode:	'dv'},
      { label: 'Dutch', languagecode:	'nl'},
      { label: 'English', languagecode:	'en'},
      { label: 'Estonian', languagecode:	'et'},
      { label: 'Fijian', languagecode:	'fj'},
      { label: 'Filipino', languagecode:'fil'},
      { label: 'Finnish', languagecode:	'fi'},
      { label: 'French', languagecode:	'fr'},
      { label: 'French (Canada)', languagecode:'fr-ca'},
      { label: 'Georgian', languagecode:	'ka'},
      { label: 'German', languagecode:	'de'},
      { label: 'Greek', languagecode:	'el'},
      { label: 'Gujarati', languagecode:	'gu'},
      { label: 'Haitian Creole', languagecode:	'ht'},
      { label: 'Hebrew', languagecode:	'he'},
      { label: 'Hindi', languagecode:	'hi'},
      { label: 'Hmong Daw	', languagecode: 'mww'},
      { label: 'Hungarian', languagecode:	'hu'},
      { label: 'Icelandic', languagecode:	'is'},
      { label: 'Indonesian', languagecode:	'id'},
      { label: 'Inuktitut', languagecode:	'iu'},
      { label: 'Irish', languagecode:	'ga'},
      { label: 'Italian', languagecode:	'it'},
      { label: 'Japanese', languagecode:	'ja'},
      { label: 'Kannada', languagecode:	'kn'},
      { label: 'Kazakh', languagecode:	'kk'},
      { label: 'Khmer', languagecode:	'km'},
      { label: 'Klingon', languagecode: 'tlh-Latn'},
      { label: 'Klingon (plqaD)', languagecode: 'tlh-Piqd'},	
      { label: 'Korean', languagecode:	'ko'},
      { label: 'Kurdish (Central)', languagecode:	'ku'},
      { label: 'Kurdish (Northern)', languagecode: 'kmr'},
      { label: 'Kyrgyz', languagecode:	'ky'},
      { label: 'Lao', languagecode:	'lo'},
      { label: 'Latvian', languagecode:	'lv'},
      { label: 'Lithuanian', languagecode:	'lt'},
      { label: 'Macedonian', languagecode:	'mk'},
      { label: 'Malagasy', languagecode:	'mg'},
      { label: 'Malay', languagecode:	'ms'},
      { label: 'Malayalam', languagecode:	'ml'},
      { label: 'Maltese', languagecode:	'mt'},
      { label: 'Maori', languagecode:	'mi'},
      { label: 'Marathi', languagecode:	'mr'},
      { label: 'Mongolian (Cyrillic)', languagecode: 'mn-Cyrl'},			
      { label: 'Mongolian (Traditional)', languagecode: 'mn-Mong'},				
      { label: 'Myanmar', languagecode:	'my'},
      { label: 'Nepali', languagecode:	'ne'},
      { label: 'Norwegian', languagecode:	'nb'},
      { label: 'Odia', languagecode:	'or'},
      { label: 'Pashto', languagecode:	'ps'},
      { label: 'Persian', languagecode:	'fa'},
      { label: 'Polish', languagecode:	'pl'},
      { label: 'Portuguese (Brazil)', languagecode:	'pt'},
      { label: 'Portuguese (Portugal)	', languagecode:'pt-pt'},		
      { label: 'Punjabi', languagecode:	'pa'},
      { label: 'Queretaro Otomi', languagecode: 'otq'},
      { label: 'Romanian', languagecode:	'ro'},
      { label: 'Russian', languagecode:	'ru'},
      { label: 'Samoan', languagecode:	'sm'},
      { label: 'Serbian (Cyrillic)', languagecode:'sr-Cyrl'},		
      { label: 'Serbian (Latin)', languagecode:'sr-Latn'},
      { label: 'Slovak', languagecode:	'sk'},
      { label: 'Slovenian', languagecode:	'sl'},
      { label: 'Spanish', languagecode:	'es'},
      { label: 'Swahili', languagecode:	'sw'},
      { label: 'Swedish', languagecode:	'sv'},
      { label: 'Tahitian', languagecode:	'ty'},
      { label: 'Tamil', languagecode:	'ta'},
      { label: 'Tatar', languagecode:	'tt'},
      { label: 'Telugu', languagecode:	'te'},
      { label: 'Thai', languagecode:	'th'},
      { label: 'Tibetan', languagecode:	'bo'},
      { label: 'Tigrinya', languagecode:	'ti'},
      { label: 'Tongan', languagecode:	'to'},
      { label: 'Turkish', languagecode:	'tr'},
      { label: 'Turkmen', languagecode:	'tk'},
      { label: 'Ukrainian', languagecode:	'uk'},
      { label: 'Urdu', languagecode:	'ur'},
      { label: 'Uyghur', languagecode:	'ug'},
      { label: 'Uzbek (Latin)', languagecode:	'uz'},
      { label: 'Vietnamese', languagecode:	'vi'},
      { label: 'Welsh', languagecode:	'cy'},
      { label: 'Yucatec Maya', languagecode:'yua'},
    ];

  return (
    <div>
        <TextField
            id="filled-multiline-static"
            label="Input field"
            multiline
            rows={4}
            defaultValue="I will detect your, language"
            variant="filled"
            onChange={(event) => {
                setUserText(event.target.value);
              }}
        />

        <div>
          {translationOutput}
        </div>
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

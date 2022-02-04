import { gql } from "@apollo/client";

export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const ADD_SKILL = gql`
  mutation addSkill($profileId: ID!, $skill: String!) {
    addSkill(profileId: $profileId, skill: $skill) {
      _id
      name
      skills
    }
  }
`;

export const ADD_INPUT_PHRASE = gql`
  mutation addInputPhrase($profileId: ID!, $inputPhrase: String!) {
    addInputPhrase(profileId: $profileId, inputPhrase: $inputPhrase) {
      _id
      name
      inputPhrases
    }
  }
`;

export const ADD_TRANSLATED_PHRASE = gql`
  mutation addTranslatedPhrase($profileId: ID!, $translatedPhrase: String!) {
    addTranslatedPhrase(
      profileId: $profileId
      translatedPhrase: $translatedPhrase
    ) {
      _id
      name
      translatedPhrases
    }
  }
`;

export const REMOVE_ALL_TRANSLATIONS = gql`
  mutation removeAllTranslations($profileId: ID!) {
    removeAllTranslations(profileId: $profileId) {
      _id
      name
      inputPhrases
      translatedPhrases
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

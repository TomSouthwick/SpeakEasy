<div id="top"></div>
<div align="center">

[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![linkedin][linkedin-shield]][linkedin-url]

</div>
 <br />
 <br />

<div align="center">
<img src="assets/readme.png">
</div>

<h3 align="center">Speak Easy</h3>

  <p align="center">
    Speak Easy is a dynamic app that allows a user to translate either their voice or written text into over 110 different languages! This app uses Microsoft Azure's Cognitive Speech SDK! The App allows for recent phrases and inputs to be stored within React, which allows the user to input their recent phrases to be translated out again into the language of their choosing. This lightweight mobile-friendly app is designed to be accessed from around the world in the hopes of removing communication barriers between visitors and their country of choosing! 
    <br />
    <a href="https://github.com/TomSouthwick/SpeakEasy"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    ·
    <a href="https://youtu.be/2JY0Rd7fpaw">View Demo</a>
    ·
    <a href="https://github.com/TomSouthwick/SpeakEasy">Report Bug</a>
    ·
    <a href="https://github.com/TomSouthwick/SpeakEasy">Request Feature</a>
  </p>
</div>
<div align="center">
<img src="assets/demo.gif" width="90%" height="100%">
</div>
 <br />
 <br />
<!-- TABLE OF CONTENTS -->
<h3/>
<b/>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>
</h3>
</b>
 <br />
 <br />

<!-- ABOUT THE PROJECT -->

## About The Project

 <br />

<img src="assets/screenshot2.png" width="100%" height="750">
 <br />

This project was desgined so that users can translate from one language to another easily. The user can either type or speak into the microphone in order to present the required text to be translated. Once the text is translated, it then can either be read or spoken allowed in the native voice of that selected language. Using the Cognitive Speech SDK from Azure, the app has the ability to have each language spoken or interpreted natively. This provides a user with a unique feature to hear the translated statement spoken in the desired language by someone who is fluent in that language. The requests to the server can only be made with a logged in User.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Cognitive Speech Services](https://azure.microsoft.com/en-au/services/cognitive-services/speech-services/)
- [Material-UI](https://mui.com/)
- [GraphQL](https://graphql.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JSON-Web-Token](https://jwt.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Clone the repo into a local folder. Open that folder in VS Code.

### Prerequisites

Ensure that VS Code has the required languages inc. JS, Express, and React with the respective functionalities built in.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/TomSouthwick/SpeakEasy.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run develop
   ```sh
   npm run develop
   ```


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

A user will be promoted to add in their manager and any other respective colleagues that they work with. Once they've completed all entries, the user can open the output folder, and `team.html` in the browser to see their team displayed own their own unique cards. Make sure you run a test after generating your content to ensure that all the clases respective fields have been put in and have called accordingly.

_For more examples, please refer to the [Documentation](https://github.com/TomSouthwick/Team-Profile-Generator)_

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- ✅ Creating a functioning inquirer prompt.
- ✅ Creating and extending classes as a property.
- ✅ Linking answers into a dynamic html element.
  - ✅ html generator is vanilla and does not use any frameworks.
- ✅ Creating and writing testing methods.
  - ✅ Passing all the testing methods.

See the [open issues](https://github.com/TomSouthwick/Team-Profile-Generator/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Tom Southwick - [Linkedin](https://linkedin.com/in/tomsouthwick)

Project Link: [https://github.com/TomSouthwick/Team-Profile-Generator](https://github.com/TomSouthwick/SpeakEasy)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [ReadMe](https://github.com/othneildrew/Best-README-Template.git)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[issues-shield]: https://img.shields.io/github/issues/TomSouthwick/SpeakEasy.svg?style=for-the-badge
[issues-url]: https://github.com/TomSouthwick/SpeakEasy/issues
[license-shield]: https://img.shields.io/github/license/TomSouthwick/SpeakEasy.svg?style=for-the-badge
[license-url]: https://github.com/TomSouthwick/SpeakEasy/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/tomsouthwick
[product-screenshot]: images/screenshot.png
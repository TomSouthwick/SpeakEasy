    // var phraseDiv;
    // var resultDiv;
    // var startSpeakTextAsyncButton;

    // // subscription key and region for speech services.
    // var subscriptionKey, serviceRegion;
    // var SpeechSDK;
    // var synthesizer;

    // document.addEventListener("DOMContentLoaded", function () {
    //   startSpeakTextAsyncButton = document.getElementById("startSpeakTextAsyncButton");
    //   // process.env
    //   subscriptionKey = document.getElementById("subscriptionKey");
    //   serviceRegion = document.getElementById("serviceRegion");
    //   // translation output.value
    //   phraseDiv = document.getElementById("phraseDiv");
    //   resultDiv = document.getElementById("resultDiv");

    //   startSpeakTextAsyncButton.addEventListener("click", function () {
    //     startSpeakTextAsyncButton.disabled = true;
    //     phraseDiv.innerHTML = "";

    //     if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
    //       alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
    //       startSpeakTextAsyncButton.disabled = false;
    //       return;
    //     }
    //     var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);

    //     synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    //     let inputText = phraseDiv.value;
    //     synthesizer.speakTextAsync(
    //       inputText,
    //       function (result) {
    //         startSpeakTextAsyncButton.disabled = false;
    //         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //           resultDiv.innerHTML += "synthesis finished for [" + inputText + "].\n";
    //         } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
    //           resultDiv.innerHTML += "synthesis failed. Error detail: " + result.errorDetails + "\n";
    //         }
    //         window.console.log(result);
    //         synthesizer.close();
    //         synthesizer = undefined;
    //       },
    //       function (err) {
    //         startSpeakTextAsyncButton.disabled = false;
    //         // resultDiv.innerHTML += "Error: ";
    //         // resultDiv.innerHTML += err;
    //         // resultDiv.innerHTML += "\n";
    //         window.console.log(err);

    //         synthesizer.close();
    //         synthesizer = undefined;
    //     });
    //   });

    //   if (!!window.SpeechSDK) {
    //     SpeechSDK = window.SpeechSDK;
    //     startSpeakTextAsyncButton.disabled = false;

    //     document.getElementById('content').style.display = 'block';
    //     document.getElementById('warning').style.display = 'none';

    //     // in case we have a function for getting an authorization token, call it.
    //     if (typeof RequestAuthorizationToken === "function") {
    //         RequestAuthorizationToken();
    //     }
    //   }
    // });
  
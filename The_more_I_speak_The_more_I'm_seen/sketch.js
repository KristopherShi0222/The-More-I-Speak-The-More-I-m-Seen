let density;
let defaultDensity = "TheMoreISpeakTheMoreI'mSeen" + "*,._.           ";
let said = "The More I Speak, The More I'm Seen";
let video;
let asciiDiv;

let useSpeech = false;

let output;

// Define a mapping of letters to their corresponding values
const letterValues = {
  g: 19.8,
  q: 18.1,
  d: 17.8,
  b: 17.2,
  p: 17.1,
  m: 17.1,
  a: 16.7,
  e: 16.2,
  k: 14.4,
  w: 14.4,
  o: 14.3,
  h: 13.8,
  y: 13.1,
  z: 13.1,
  s: 12.8,
  u: 12.1,
  x: 12,
  f: 12,
  n: 11.9,
  t: 11.8,
  i: 11.5,
  c: 11,
  j: 11,
  l: 10.5,
  v: 10.3,
  r: 8.14,
  "*": 7.16,
};

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
// startButton.addEventListener("click", function() {
//   console.log("button working");
// });

// startButton.addEventListener("click", toggleSpeech);

startButton.addEventListener("click", startSpeech);
stopButton.addEventListener("click", stopSpeech);

function startSpeech() {
  startButton.style.display = "none";
  stopButton.style.display = "block";
  useSpeech = true;
}

function stopSpeech() {
  startButton.style.display = "block";
  stopButton.style.display = "none";
  useSpeech = false;
  said = "The More I Speak, The More I'm Seen";
    output.html(said);
}


function setup() {
  noCanvas();
  //create video capture
  video = createCapture(VIDEO);
  video.size(200, 70);
  video.hide(); // hide the video
  asciiDiv = createDiv();
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  
  // "Continuous recognition" (as opposed to one time onl
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);
  speechRec.onEnd = function restartRec(){
    speechRec.start(continuous, interimResults) 
  }
  // DOM element to display results
  output = select("#speech");
  output.html(said);

  // Speech recognized event
  function gotSpeech() {
    console.log(useSpeech);
    // Something is there
    // Get it as a string, you can also get JSON with more info
    console.log(speechRec);
    if (!useSpeech) {
      said = "The More I Speak, The More I'm Seen";
      output.html(said);
    } else if (useSpeech == true && speechRec.resultValue) {
      said = speechRec.resultString; // set 'said' as what the user said

      output.html(said);
      //make an array to compare the value of each letter in the sentence that the user said
      let saidArray = said.split("").filter((char) => char in letterValues);
      saidArray.sort((a, b) => letterValues[b] - letterValues[a]);
      console.log(saidArray);
      let saidDensity = "";
      for (let i = 0; i < saidArray.length; i++) {
        saidDensity += saidArray[i];
      }
      console.log(saidDensity);
      //the final density spectrum used in the image
      density = str(saidDensity) + ",._.           ";
    }
  }
}

function draw() {
  if (!useSpeech) {
    density = defaultDensity;
  }

  video.loadPixels();
  let outputImage = select("#outputimage");
  let asciiImage = "";
  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;
      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, 0, len));
      const c = density.charAt(charIndex);
      if (c == " ") asciiImage += "&nbsp;";
      else asciiImage += c;
    }
    asciiImage += "<br/>";
  }
  outputImage.html(asciiImage);
  //
}


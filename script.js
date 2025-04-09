let voices = [];
let clonedVoiceParams = { pitch: 1.0, rate: 1.0 };

// Load available voices when the browser is ready
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
};

// Speak typed text with selected language and style
function speakText() {
  const text = document.getElementById("voiceInput").value;
  const lang = document.getElementById("languageSelect").value;
  const style = document.getElementById("voiceStyle").value;

  if (!text) {
    alert("Please enter text to speak.");
    return;
  }

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;

  // Set voice style
  if (voices.length > 0) {
    if (style === "male") {
      msg.voice = voices.find(v => v.name.toLowerCase().includes("male")) || voices[0];
    } else if (style === "female") {
      msg.voice = voices.find(v => v.name.toLowerCase().includes("female")) || voices[0];
    } else if (style === "cloned") {
      msg.pitch = clonedVoiceParams.pitch;
      msg.rate = clonedVoiceParams.rate;
      msg.voice = voices.find(v => v.lang === lang) || voices[0];
    } else if (style === "robot") {
      msg.pitch = 0.5;
      msg.rate = 0.8;
    } else {
      msg.voice = voices.find(v => v.lang === lang) || voices[0];
    }
  }

  window.speechSynthesis.speak(msg);
}

// Fake translation feature
function translateAndSpeak() {
  const text = document.getElementById("voiceInput").value;
  if (!text) {
    alert("Please enter text to translate.");
    return;
  }
  alert("Simulating translation (Add a real translation API for full feature)");
  speakText();
}

// Voice cloning simulation from uploaded audio
function analyzeVoiceSample() {
  const input = document.getElementById("voiceUpload");
  const audio = document.getElementById("uploadedAudio");

  const file = input.files[0];
  if (!file) {
    alert("Please upload a voice sample.");
    return;
  }

  const url = URL.createObjectURL(file);
  audio.src = url;

  // Simulated pitch/rate changes
  const randomPitch = 0.8 + Math.random() * 0.4;
  const randomRate = 0.9 + Math.random() * 0.2;
  clonedVoiceParams = { pitch: randomPitch, rate: randomRate };

  alert(`Voice cloned! Pitch: ${randomPitch.toFixed(2)}, Rate: ${randomRate.toFixed(2)}. Use 'Cloned Voice' to try.`);
}

// Simulated dubbing to play voice over video
function dubVideo() {
  const text = document.getElementById("dubText").value;
  const video = document.getElementById("myVideo");
  if (!text) {
    alert("Enter dubbing text.");
    return;
  }

  video.play();

  setTimeout(() => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = document.getElementById("languageSelect").value;

    if (document.getElementById("voiceStyle").value === "cloned") {
      msg.pitch = clonedVoiceParams.pitch;
      msg.rate = clonedVoiceParams.rate;
    }

    window.speechSynthesis.speak(msg);
  }, 1000); // fake sync
}

// Downloading audio is tricky without a backend or Recorder.js
function downloadAudio() {
  alert("Audio download feature needs additional tools like Recorder.js or server-side processing.");
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

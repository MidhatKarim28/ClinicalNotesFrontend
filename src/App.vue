<!-- Updated version -->
<template>
  <div id="app">
    <h1>AI Clinical Notes Generator</h1>
    <div class="container">
      <div class="input-section">
        <h2>Patient Context</h2>
        <textarea v-model="patientContext" placeholder="Enter patient context here"></textarea>
      </div>
      <div class="transcription-section">
        <h2>Transcription</h2>
        <div class="transcription-box" ref="transcriptionBox">{{ transcription }}</div>
      </div>
      <div class="clinical-note-section">
        <h2>Clinical Note</h2>
        <div class="clinical-note-box">{{ clinicalNote }}</div>
      </div>
      <div class="button-section">
        <button @click="startEncounter" :disabled="isRecording">Start Encounter</button>
        <button @click="stopEncounter" :disabled="!isRecording">Stop Encounter</button>
        <button @click="generateClinicalNote" :disabled="!transcription">Generate Clinical Note</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      patientContext: '',
      transcription: '',
      clinicalNote: '',
      isRecording: false,
      transcriptionInterval: null,
    };
  },
  methods: {
    async startEncounter() {
      this.isRecording = true;
      this.transcription = '';
      this.simulateTranscription();
    },
    async stopEncounter() {
      this.isRecording = false;
      clearInterval(this.transcriptionInterval);
    },
    simulateTranscription() {
      const sentences = [
        "Patient complains of persistent headache.",
        "The pain is described as throbbing and localized to the front of the head.",
        "Symptoms started three days ago and have been getting worse.",
        "Patient reports difficulty sleeping due to the pain.",
        "No history of migraines or recent head injuries.",
        "Patient has tried over-the-counter pain medication with little relief.",
        "No other symptoms such as nausea or visual disturbances.",
        "Patient's vital signs are within normal range.",
        "Neurological exam shows no abnormalities.",
        "Recommending further tests to rule out underlying causes."
      ];
      let sentenceIndex = 0;
      this.transcriptionInterval = setInterval(() => {
        if (sentenceIndex < sentences.length) {
          this.transcription += sentences[sentenceIndex] + " ";
          sentenceIndex++;
          this.(() => {
            const box = this..transcriptionBox;
            box.scrollTop = box.scrollHeight;
          });
        } else {
          clearInterval(this.transcriptionInterval);
        }
      }, 2000);
    },
    async generateClinicalNote() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/generate-clinical-note`, {
          patientContext: this.patientContext,
          transcription: this.transcription
        });
        this.clinicalNote = response.data.clinicalNote;
      } catch (error) {
        console.error('Error generating clinical note:', error);
        this.clinicalNote = 'Error generating clinical note. Please try again.';
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.input-section, .transcription-section, .clinical-note-section {
  width: 100%;
  margin-bottom: 20px;
}

textarea, .transcription-box, .clinical-note-box {
  width: 100%;
  height: 150px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.transcription-box, .clinical-note-box {
  text-align: left;
  overflow-y: auto;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

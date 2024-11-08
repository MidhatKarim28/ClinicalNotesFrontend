
import React, { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcriptWithTimestamps, setTranscriptWithTimestamps] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleListing = useCallback(() => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setStartTime(Date.now());
      resetTranscript();
      setTranscriptWithTimestamps([]);
    }
    setIsListening(!isListening);
  }, [isListening]);

  useEffect(() => {
    if (transcript) {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000; // in seconds
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = Math.floor(elapsedTime % 60);
      const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      setTranscriptWithTimestamps(prev => [
        ...prev,
        { timestamp, text: transcript }
      ]);
    }
  }, [transcript, startTime]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition software.</div>;
  }

  return (
    <div className="App">
      <h1>Real-Time Speech Transcription</h1>
      <button onClick={handleListing}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div>
        {transcriptWithTimestamps.map((item, index) => (
          <p key={index}>
            <strong>{item.timestamp}</strong> {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;

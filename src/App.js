
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const timestamp = new Date().toTimeString().split(' ')[0];
        setTranscript(prev => [...prev, { time: timestamp, text: currentTranscript }]);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div className="App">
      <h1>Speech to Text Transcription</h1>
      <button onClick={handleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="transcript">
        {transcript.map((item, index) => (
          <p key={index}>
            <span className="timestamp">{item.time}</span> {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;


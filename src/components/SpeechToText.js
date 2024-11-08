
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        startTimeRef.current = new Date();
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscriptChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptChunk += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTimeRef.current) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (finalTranscriptChunk) {
          setFinalTranscript(prev => prev + `${timestamp} ${finalTranscriptChunk}\n`);
        }
        setTranscript(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.log('Web Speech API is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="speech-to-text">
      <h1>Real-Time Speech Transcription</h1>
      <button onClick={toggleListening} className={isListening ? 'listening' : ''}>
        {isListening ? <FaStop /> : <FaMicrophone />}
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div className="transcript">
        <h2>Transcript:</h2>
        <pre>{finalTranscript}</pre>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechToText;

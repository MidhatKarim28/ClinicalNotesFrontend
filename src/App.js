import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [error, setError] = useState('');
  const websocketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscription('');
    setError('');
    websocketRef.current = new WebSocket('ws://localhost:5000/ws');
    websocketRef.current.onmessage = (event) => {
      setTranscription((prev) => prev + ' ' + event.data);
    };
    websocketRef.current.onerror = (event) => {
      setError('WebSocket error occurred');
      setIsRecording(false);
    };
    websocketRef.current.onclose = () => {
      if (isRecording) {
        setError('WebSocket connection closed unexpectedly');
        setIsRecording(false);
      }
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  };

  const generateNotes = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:5000/api/RealTimeTranscription/generate-notes', {
        transcription: transcription,
        patientContext: patientContext
      });
      setClinicalNotes(response.data);
    } catch (error) {
      console.error('Error generating clinical notes:', error);
      setError('Failed to generate clinical notes. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">AI Clinical Notes Generator</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Patient Context</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={patientContext}
              onChange={(e) => setPatientContext(e.target.value)}
              placeholder="Enter patient context here..."
            />
          </Form.Group>
          <Button
            variant={isRecording ? "danger" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            className="mb-3"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Form.Group>
            <Form.Label>Real-time Transcription</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={transcription}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Button
            variant="success"
            onClick={generateNotes}
            className="mb-3"
            disabled={!transcription}
          >
            Generate Clinical Notes
          </Button>
          <Form.Group>
            <Form.Label>Generated Clinical Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={clinicalNotes}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import HealthSurveyForm from './components/HealthSurveyForm';
import { generateNoisyObject } from './utility/generateNoisyObject';
import SurveyResults from './components/SurveyResultsNov30';
import './App.css';

const App = () => {
  console.log("hello")
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const [noiseType, setNoiseType] = useState('laplace');
  const sensitivity = 1.0;
  const epsilon = 1.0;

  const handleFormSubmit = (formData) => {
    setSubmittedData(formData);

    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
  };

  useEffect(() => {
    console.log('submittedData:', submittedData);

    //const noisyData = addNoise(submittedData, sensitivity, epsilon);
    const noisyData = generateNoisyObject(submittedData, sensitivity, epsilon, noiseType);
    console.log('noisyData:', noisyData);
    setNoisyData(noisyData);
  }, [submittedData, sensitivity, epsilon, noiseType]);

  return (
    <Container fluid className="custom-container">
      <Row>
        <Col xs={12} md={8} lg={9}>
          <div className="panel large-panel">
            <h3>Health Survey Form</h3>
            <HealthSurveyForm onSubmit={handleFormSubmit} />
          </div>
        </Col>

        <Col xs={12} md={4} lg={3}>
          <Form.Group controlId="noiseTypeDropdown">
            <Form.Label>Noise Type</Form.Label>
            <Form.Control
              as="select"
              value={noiseType}
              onChange={(e) => setNoiseType(e.target.value)}
            >
              <option value="laplace">Laplace Noise</option>
              <option value="gaussian">Gaussian Noise</option>
            </Form.Control>
          </Form.Group>

          <SurveyResults submittedData={submittedData} noisyData={noisyData} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
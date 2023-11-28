import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import HealthSurveyForm from './components/HealthSurveyForm';
import generateNoisyObject from './generateNoisyObject'; // Update import
import './App.css';

const App = () => {
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const sensitivity = 1.0;
  const epsilon = 1.0;

  const handleFormSubmit = (formData) => {
    // Update submittedData
    setSubmittedData(formData);

    // Generate and update noisyData
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon);
    setNoisyData(noisyData);
  };

  useEffect(() => {
    console.log('submittedData:', submittedData);

    // No need to check if it's an array, as it's now expecting an object
    const noisyData = generateNoisyObject(submittedData, sensitivity, epsilon);
    console.log('noisyData:', noisyData);
    setNoisyData(noisyData);
  }, [submittedData, sensitivity, epsilon]);

  return (
    <Container fluid className="custom-container">
      <Row>
        {/* Large Panel on the Left */}
        <Col xs={12} md={8} lg={9}>
          <div className="panel large-panel">
            {/* Content for the large panel goes here */}
            <h3>Health Survey Form</h3>
            <HealthSurveyForm onSubmit={handleFormSubmit} />
          </div>
        </Col>

        {/* Small Panel on Top of the Other on the Right */}
        <Col xs={12} md={4} lg={3}>
          {/* Small Panel for Submitted Data */}
          <div className="panel small-panel">
            <h3>Submitted Data</h3>
            <div>
              <strong>Exercise Frequency:</strong> {submittedData.exerciseFrequency || ''}
            </div>
            <div>
              <strong>Exercise Duration:</strong> {submittedData.exerciseDuration || ''}
            </div>
            <div>
              <strong>Exercise Intensity:</strong> {submittedData.exerciseIntensity || ''}
            </div>
            <div>
              <strong>Daily Step Count:</strong> {submittedData.dailyStepCount || ''}
            </div>
            <div>
              <strong>Sleep Duration:</strong> {submittedData.sleepDuration || ''}
            </div>
            <div>
              <strong>Weight Status:</strong> {submittedData.weightStatus || ''}
            </div>
            <div>
              <strong>Weight Change:</strong> {submittedData.weightChange || ''}
            </div>
            <div>
              <strong>Fitness Level:</strong> {submittedData.fitnessLevel || ''}
            </div>
            <div>
              <strong>App Usage Frequency:</strong> {submittedData.appUsageFrequency || ''}
            </div>
            <div>
              <strong>Caloric Intake:</strong> {submittedData.caloricIntake || ''}
            </div>
          </div>

          {/* Small Panel for Noisy Data */}
          <div className="panel small-panel">
            <h3>Noisy Data</h3>
            <div>
              <strong>Exercise Frequency:</strong> {noisyData.exerciseFrequency || ''}
            </div>
            <div>
              <strong>Exercise Duration:</strong> {noisyData.exerciseDuration || ''}
            </div>
            <div>
              <strong>Exercise Intensity:</strong> {noisyData.exerciseIntensity || ''}
            </div>
            <div>
              <strong>Daily Step Count:</strong> {noisyData.dailyStepCount || ''}
            </div>
            <div>
              <strong>Sleep Duration:</strong> {noisyData.sleepDuration || ''}
            </div>
            <div>
              <strong>Weight Status:</strong> {noisyData.weightStatus || ''}
            </div>
            <div>
              <strong>Weight Change:</strong> {noisyData.weightChange || ''}
            </div>
            <div>
              <strong>Fitness Level:</strong> {noisyData.fitnessLevel || ''}
            </div>
            <div>
              <strong>App Usage Frequency:</strong> {noisyData.appUsageFrequency || ''}
            </div>
            <div>
              <strong>Caloric Intake:</strong> {noisyData.caloricIntake || ''}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;

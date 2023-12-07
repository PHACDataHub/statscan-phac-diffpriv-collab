import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import HealthSurveyForm from './components/HealthSurveyForm';
import { generateNoisyObject } from './utility/generateNoisyObject';
import SurveyResults from './components/SurveyResults';
import { contexts } from './contexts/AppContext';
import Dropdown from './components/Dropdown';
import EpsilonSensitivitySliders from './components/EpsilonSensitivitySliders';
import { EPSILON,SENSITIVITY } from './utility/constants';
import './App.css';

const App = () => {
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const [noiseType, setNoiseType] = useState('laplace');
  const [formData, setFormData] = useState({
    exerciseFrequency: '',
    exerciseDuration: '',
    exerciseIntensity: '',
    dailyStepCount: '',
    sleepDuration: '',
    weightStatus: '',
    weightChange: '',
    fitnessLevel: '',
    appUsageFrequency: '',
    caloricIntake: '',
  });
  const [sensitivity,setSensitivity] = useState(1.0);
  const [epsilon, setEpsilon] = useState(1.0);
  const max_min_step = { [EPSILON] : [0,1,0.05], [SENSITIVITY] : [0,1,0.05] };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
  };

  useEffect(() => {
    const noisyData = generateNoisyObject(submittedData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
  }, [sensitivity, epsilon, noiseType]);

  return (
    <contexts.App.provider value={{formData,setFormData,handleFormSubmit,submittedData,noisyData,noiseType,setNoiseType,epsilon,setEpsilon,sensitivity,setSensitivity,max_min_step}}>
      <Container fluid className="custom-container">
        <Row>
          <Col xs={12} md={8} lg={9}>
            <div className="panel large-panel">
              <h3>Health Survey Form</h3>
              <HealthSurveyForm />
            </div>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <EpsilonSensitivitySliders />
            <Dropdown />
            <SurveyResults />
          </Col>
        </Row>
      </Container>
    </contexts.App.provider>
  );
};

export default App;

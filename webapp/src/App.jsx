import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import HealthSurveyForm from './components/HealthSurveyForm';
import { generateNoisyObject } from './utility/generateNoisyObject';
import SurveyResults from './components/SurveyResults';
import { contexts } from './contexts/AppContext';
import Dropdown from './components/Dropdown';
import EpsilonSensitivitySliders from './components/EpsilonSensitivitySliders';
import { EPSILON,SENSITIVITY } from './utility/constants';
import { initFormState } from './initialStates';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState(initFormState);
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const [noiseType, setNoiseType] = useState('laplace');
  const [sensitivity,setSensitivity] = useState(1.0);
  const [epsilon, setEpsilon] = useState(1.0);
  const [ submitted,setSubmitted ] = useState(0);
  const max_min_step = { [EPSILON] : [0,1,0.05], [SENSITIVITY] : [0,1,0.05] };

  const handleFormSubmit = () => {
    //setSubmitted(0);
    setSubmittedData(formData);
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
  };

  const handleFormReset = (e) => {
    e.preventDefault();
    setSubmitted(0);
    setFormData(initFormState);
    setSubmittedData({});
    setNoisyData({});
    setNoiseType('laplace');
    setEpsilon(1.0);
    setSensitivity(1.0);
  };

  useEffect(() => {
    const noisyData = generateNoisyObject(submittedData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
  }, [sensitivity, epsilon, noiseType]);

  const contextValues = {formData,setFormData,handleFormSubmit,handleFormReset,submitted,setSubmitted,submittedData,noisyData,noiseType,setNoiseType,epsilon,setEpsilon,sensitivity,setSensitivity,max_min_step};

  return (
    <contexts.App.provider value={contextValues}>
      <Container fluid className="custom-container">
        <Row>
          <Col xs={12} md={8} lg={9}>
            <div className="panel large-panel">
              <HealthSurveyForm />
            </div>
          </Col>

          <Col xs={12} md={4} lg={3}>
            <EpsilonSensitivitySliders />
            <Dropdown />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} lg={9}>
            <SurveyResults />
          </Col>
        </Row>
      </Container>
    </contexts.App.provider>
  );
};

export default App;

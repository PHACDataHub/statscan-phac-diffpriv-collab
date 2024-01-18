import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { generateNoisyObject } from './utility/generateNoisyObject';
import { contexts } from './contexts/AppContext';
import { EPSILON,SENSITIVITY } from './utility/constants';
import { initFormState } from './initialStates';

import HealthSurveyForm from './components/HealthSurveyForm';
import SurveyResults from './components/SurveyResults';
import Dropdown from './components/Dropdown';
import EpsilonSensitivitySliders from './components/EpsilonSensitivitySliders';
import LaplaceDistPlot from './components/LaplaceDistPlot';
import FinalOutput from './components/FinalOutput'
import './App.css';

const App = () => {
  const [formData, setFormData] = useState(initFormState);
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const [noiseType, setNoiseType] = useState('laplace');
  const [sensitivity,setSensitivity] = useState(1.0);
  const [epsilon, setEpsilon] = useState(1.0);
  const [submitted,setSubmitted] = useState(0);
  const [filledAndValid,setFilledAndValid] = useState(false);
  const [finalOutput,setFinalOutput] = useState({});

  const max_min_step = { [EPSILON] : [0,1,0.05], [SENSITIVITY] : [0,1,0.05] };
  const style = {
      "paddingTop": '25vh',
      "paddingBottom": '25vh'
    };
  const style2 = {
      "paddingTop": '30vh',
      "paddingBottom": '30vh'
    };

  const handleFormSubmit = () => {
    setSubmittedData(formData);
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
    window.scrollTo({top:document.getElementsByClassName("fade")[1].offsetTop});
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
    setFilledAndValid(false);
    setFinalOutput({});
  };

  useEffect(() => {
    if(filledAndValid && submitted > 0){
      setSubmittedData(formData);
      const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
      setNoisyData(noisyData);
    }
  }, [ formData, sensitivity, epsilon, noiseType]);

  const contextValues = {formData,setFormData,
                         handleFormSubmit,
                         handleFormReset,
                         submitted,setSubmitted,
                         submittedData,
                         noisyData,
                         noiseType,setNoiseType,
                         epsilon,setEpsilon,
                         sensitivity,setSensitivity,
                         max_min_step,
                         setFilledAndValid,
                         finalOutput,setFinalOutput};

  return (
    <contexts.App.provider value={contextValues}>
      <Container fluid className="custom-container" >
        <Row style={style} className="fade">
          <Col xs={12} md={12} lg={12}>
            <div className="panel large-panel">
              <HealthSurveyForm />
            </div>
          </Col>
        </Row>
        <Row className="fade">
          {Object.entries(submittedData).length != 0 &&
            <Row style={style}>
              <Col xs={12} md={8} lg={9}>
                <SurveyResults />
              </Col>
              <Col xs={12} md={4} lg={3}>
                <LaplaceDistPlot />
                <EpsilonSensitivitySliders />
                <br></br>
                <Dropdown />
              </Col>
            </Row>
          }
        </Row>
        <Row className="fade">
          {Object.entries(finalOutput).length != 0 &&
            <Row style={style2} className="fade">
              <Col xs={12} md={12} lg={12}>
                <div className="panel large-panel">
                  <FinalOutput />
                </div>
              </Col>
            </Row>
        }
        </Row>
      </Container>
    </contexts.App.provider>
  );
};

export default App;

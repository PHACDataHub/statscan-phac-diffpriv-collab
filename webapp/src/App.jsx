import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { generateNoisyObject } from './utility/generateNoisyObject';
import { contexts } from './contexts/AppContext';
import { EPSILON,SENSITIVITY } from './utility/constants';
import { initFormState,classNames } from './initialStates';

import HealthSurveyForm from './components/HealthSurveyForm';
import FinalOutput from './components/FinalOutput'
import './App.css';
import IntermediateResults from './components/IntermediateResults';

const App = () => {
  const formRef = useRef(null);
  const submittedDataRef = useRef(null);
  const finalOutputRef = useRef(null);
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

  const handleFormSubmit = () => {
    setSubmittedData(formData);
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
    document.getElementsByClassName('submittedData')[0].classList.replace('hide','show');
    const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
    window.scrollTo({top:height*2,behavior: "smooth"});
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
    for(let x = document.getElementsByClassName("show").length - 1; x >= 0; x--){
      document.getElementsByClassName("show")[x].classList.replace("show","hide");
    }
  };
  const inc = 0.01;
  const threshold = [...Array(1/inc),1].map((_, i) => (i*inc))
  const options = {
    root : null,
    rootMargin : "0px",
    threshold: threshold
  }

  const callback = (entries,observer) => {
      entries.forEach(entry => {
          const intersectionRatio = entry.intersectionRatio;
          let val = 0;
          for(let x = 1; x < threshold.length; x++){
            if(intersectionRatio >= threshold[x-1] && intersectionRatio <= threshold[x]){
              val = threshold[x];
              break;
            }
          }
          const startOpacity = 0;
          const endOpactity = 1;
          const opacity = startOpacity + ((endOpactity - startOpacity) * val)

          const startX = -150;
          const endX = -50;
          const X = startX + ((endX - startX) * val);
          const el = entry.target.parentElement.children[1];   
          el.style.opacity = opacity;
          el.style.transform = `translate(${X}%,-50%)`;
      });
    }
 
  const formObserver = new IntersectionObserver(callback,options);
  const submittedDataObserver = new IntersectionObserver(callback,options);
  const finalOutputObserver = new IntersectionObserver(callback,options);

  useEffect(() => {
    if(formRef.current){
      formObserver.observe(formRef.current);
    }

    if(submittedDataRef.current){
      //submittedDataObserver.observe(submittedDataRef.current);
      formObserver.observe(submittedDataRef.current);
    }

    if(finalOutputRef.current){
      //finalOutputObserver.observe(finalOutputRef.current);
      formObserver.observe(finalOutputRef.current);
    }

    if(filledAndValid && submitted > 0){
      setSubmittedData(formData);
      const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
      setNoisyData(noisyData);
    }
    return () => {
      formObserver.disconnect();
      submittedDataObserver.disconnect();
      finalOutputObserver.disconnect();
    }
  }, [formRef.current, submittedDataRef.current, finalOutputRef.current,
      formData, sensitivity, epsilon, noiseType]);

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
    <div style={{ height: '100%',width: '100%'}}>
        <div className='sidebar'></div>
        <div style={{ height: '100%',width: '100%',backgroundColor: '#3d958c',padding: '0'}}></div>
        <div className='form getHeight'  
          style={{ position: 'relative', height: '100%',width: '100%',backgroundColor:'#ADEFD1FF',padding: '0'}}>
          <div ref={formRef} className='offsetBox'></div>
          <div className='box'>
             <Container fluid className="custom-container">
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <div className="panel large-panel">
                  <HealthSurveyForm />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <div className='submittedData hide getHeight'  
         style={{position: 'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF', padding: '0'}}>
          <div ref={submittedDataRef} className='offsetBox'></div>
          <div className='box'>
          {Object.entries(submittedData).length != 0 &&
              <IntermediateResults/>}
          </div>
        </div>
        <div className='finalOutput hide getHeight'
         style={{position: 'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF',padding: '0'}}>
          <div ref={finalOutputRef} className='offsetBox'></div>
          <div className='box'>
          {Object.entries(finalOutput).length != 0 &&
            <Container fluid className="custom-container">
              <Row >
                <Col xs={12} md={12} lg={12}>
                  <div className="panel large-panel">
                    <FinalOutput />
                  </div>
                </Col>
              </Row>
            </Container> }
          </div>
        </div>
    </div>
    </contexts.App.provider>
  );
};

export default App;

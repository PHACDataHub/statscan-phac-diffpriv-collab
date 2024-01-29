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
//import {observer,pageObserver} from './components/IntersectionObservers';

const App = () => {
  const formRef = useRef(null);
  const pages = useRef(null);
  const previousWidth = useRef('25%');
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
    for(let x = document.getElementsByClassName("show").length - 1; x >= 1; x--){
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

  const options2 = {
    root : null,
    rootMargin : "0px",
    threshold: 0.70
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

          const startY = 50;
          const endY = -50;
          const Y = startY + ((endY - startY) * val);

          const el = entry.target.parentElement.children[1];   
          el.style.opacity = opacity;
          //el.style.transform = `translate(${X}%,-50%)`;
          el.style.transform = `translate(-50%,${Y}%)`;
      });
    }
 
  const callback2 = (entries,observer) => {
    const el = document.getElementsByClassName('progressbar')[0];
    entries.forEach(entry => {
        const fromWidth = previousWidth.current;
        let toWidth = previousWidth.current;
        const timing = {duration: 500,iterations: 1};
        if(entry.target.classList.contains('page1') && entry.isIntersecting){
          toWidth = '25%' ;
        }
        else if(entry.target.classList.contains('form') && entry.isIntersecting){
          toWidth = '50%';
        }
        else if(entry.target.classList.contains('submittedData') && entry.isIntersecting){
          toWidth = '75%';
        }
        else if(entry.target.classList.contains('finalOutput') && entry.isIntersecting){
          toWidth = '100%';
        }
        document.getElementsByClassName('progressbar')[0].animate({width: [fromWidth,toWidth]},timing)
        previousWidth.current = toWidth;          
        el.style.width = toWidth;
    })
  }

  const observer = new IntersectionObserver(callback,options);
  const pageObserver = new IntersectionObserver(callback2,options2);

  useEffect(() => {
    if(pages.current){
      pageObserver.observe(document.getElementsByClassName('page1')[0]);
      pageObserver.observe(document.getElementsByClassName('form')[0]);
      pageObserver.observe(document.getElementsByClassName('submittedData')[0]);
      pageObserver.observe(document.getElementsByClassName('finalOutput')[0]);
    }
    if(formRef.current){
      observer.observe(formRef.current);
    }

    if(submittedDataRef.current){
      observer.observe(submittedDataRef.current);
    }

    if(finalOutputRef.current){
      observer.observe(finalOutputRef.current);
    }

    if(filledAndValid && submitted > 0){
      setSubmittedData(formData);
      const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
      setNoisyData(noisyData);
    }

    //Clean up function -> Disconnect observer before component re/unmounts
    return () => {
      observer.disconnect();
      pageObserver.disconnect();
    }
  }, [pages.current, formRef.current, submittedDataRef.current, finalOutputRef.current,
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
    <div ref={pages} style={{ height: '100%',width: '100%'}}>
        <div className='progressbar'></div>
        <div className='sidebar'></div>
        <div className='page1' style={{ height: '100%',width: '100%',backgroundColor: '#3d958c',padding: '0',borderBottom:'solid'}}></div>
        <div className='form show getHeight'  
          style={{ position: 'relative', height: '100%',width: '100%',backgroundColor:'#ADEFD1FF',padding: '0'}}>
          <div ref={formRef} className='offsetBox'></div>
          <div className='box'>
             <Container fluid className="custom-container">
              <Row>
                <Col sm={12} md={12} lg={12}>
                  <div className="panel large-panel" style={{backgroundColor: '#00203f',color: 'white',border: 'solid white',borderRadius:'10px'}}>
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
                  <div className="panel large-panel" style={{backgroundColor: '#ADEFD1FF',color: 'white',border: 'solid #00203f',borderRadius:'10px'}}>
                    <FinalOutput />
                  </div> }
          </div>
        </div>
    </div>
    </contexts.App.provider>
  );
};

export default App;

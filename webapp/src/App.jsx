import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { generateNoisyObject } from './utility/generateNoisyObject';
import { contexts } from './contexts/AppContext';
import { EPSILON,SENSITIVITY } from './utility/constants';
import { initFormState,classNames,pageNumbers,pageMetaData } from './initialStates';

import HealthSurveyForm from './components/HealthSurveyForm';
import FinalOutput from './components/FinalOutput'
import './App.css';
import PageOne from './components/PageOne';
import WhatIs from './components/WhatIs';
import Guide from './components/Guide';
import IntermediateResults from './components/IntermediateResults';
import Qbox from './components/Qbox';
import Sidebar from './components/Sidebar';
import GoingForward from './components/GoingForward';

const App = () => {
  const formRef = useRef(null);
  const pages = useRef(null);
  const qboxRef = useRef(null);
  const previousWidth = useRef('25%');
  const submittedDataRef = useRef(null);
  const finalOutputRef = useRef(null);
  const guideRef = useRef(null);
  const whatIsRef = useRef(null);
  const goingForwardRef = useRef(null);
  const pageMetaRef = useRef(pageMetaData);
  const [pageNo,setPageNo] = useState(1);
  const [pageMeta,setPageMeta] = useState(pageMetaData);
  const [formData, setFormData] = useState(initFormState);
  const [submittedData, setSubmittedData] = useState({});
  const [noisyData, setNoisyData] = useState({});
  const [noiseType, setNoiseType] = useState('laplace');
  const [sensitivity,setSensitivity] = useState(1.0);
  const [epsilon, setEpsilon] = useState(1.0);
  const [submitted,setSubmitted] = useState(0);
  const [filledAndValid,setFilledAndValid] = useState(false);
  const [finalOutput,setFinalOutput] = useState({});
  const [pageLoaded,setPageLoaded] = useState(false);

  const max_min_step = { [EPSILON] : [0.05,1,0.05], [SENSITIVITY] : [0,1,0.05] };

  const handleFormSubmit = () => {
    setSubmittedData(formData);
    const noisyData = generateNoisyObject(formData, sensitivity, epsilon, noiseType);
    setNoisyData(noisyData);
    document.getElementsByClassName('submittedData')[0].classList.replace('hide','show');
    const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
    if(pageLoaded){
      window.scrollTo({top:height*(pageNumbers['intermediate']-1),behavior: "smooth"});
    }
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
    setPageLoaded(true);
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
    threshold: [0.7]
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
          el.style.transform = `translate(${X}%,-50%)`;
          //el.style.transform = `translate(-50%,${Y}%)`;
      });
    }
 
  const callback2 = (entries,observer) => {
    const el = document.getElementsByClassName('progressbar')[0];
    entries.forEach(entry => {
      //console.log(entry.target,entry.isIntersecting,entry.intersectionRatio);
        const fromWidth = previousWidth.current;
        let toWidth = previousWidth.current;
        const timing = {duration: 500,iterations: 1};
        let showQBox = 'block';
        let pageNoCopy = qboxRef.current.pageNo;
        const pages = Object.keys(pageNumbers);
        const toWidths = pages.map((_,idx) => ((100*(idx)/(pages.length-2)).toString()+'%'));
        if(entry.target.classList.contains('page1') && entry.isIntersecting){
          toWidth = toWidths[0];
          showQBox = 'none';
          pageNoCopy = 1;
        }
        if(entry.target.classList.contains('page2') && entry.isIntersecting){
          toWidth = toWidths[1];
          showQBox = 'block'; 
          pageNoCopy = 2;
        }
        if(entry.target.classList.contains('page3') && entry.isIntersecting){
          toWidth = toWidths[2];
          showQBox = 'block'; 
          pageNoCopy = 3;
        }
        if(entry.target.classList.contains('form') && entry.isIntersecting){
          toWidth = toWidths[3];
          showQBox = 'block'; 
          pageNoCopy = 4;
        }
        if(entry.target.classList.contains('submittedData') && entry.isIntersecting){
          toWidth = toWidths[4];
          showQBox = 'block'; 
          pageNoCopy = 5;
        }
        if(entry.target.classList.contains('finalOutput') && entry.isIntersecting){
          toWidth = toWidths[5];
          showQBox = 'block'; 
          pageNoCopy = 6;
        }
        if(entry.target.classList.contains('goingForward') && entry.isIntersecting){
          toWidth = toWidths[6];
          showQBox = 'block'; 
          pageNoCopy = 7;
        }
        document.getElementsByClassName('progressbar')[0].animate({width: [fromWidth,toWidth]},timing)
        previousWidth.current = toWidth;          
        // qboxRef.current.style.display = (pageNoCopy >= pageNumbers['surveyForm']) ? 'block' : 'none';
        //console.log(pageMeta);
        qboxRef.current.style.display = pageMetaRef.current[pageNoCopy].showQBox ? 'block' : 'none';
        qboxRef.current.pageNo = pageNoCopy;
        setPageNo(pageNoCopy);
        el.style.width = toWidth;
    })
  }

  const observer = new IntersectionObserver(callback,options);
  const pageObserver = new IntersectionObserver(callback2,options2);

  useEffect(()=>{
      document.title = "LDP Demo";
      document.getElementById("randomizeFormData").click();
      document.getElementById("submitFormData").click();
  },[]);

  useEffect(() => {
    if(pages.current){
      pageObserver.observe(document.getElementsByClassName('page1')[0]);
      pageObserver.observe(document.getElementsByClassName('page2')[0]);
      pageObserver.observe(document.getElementsByClassName('page3')[0]);
      pageObserver.observe(document.getElementsByClassName('form')[0]);
      pageObserver.observe(document.getElementsByClassName('submittedData')[0]);
      pageObserver.observe(document.getElementsByClassName('finalOutput')[0]);
      pageObserver.observe(document.getElementsByClassName('goingForward')[0]);
      qboxRef.current.pageNo = 1;
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

    if(guideRef.current){
      observer.observe(guideRef.current);
    }

    if(whatIsRef.current){
      observer.observe(whatIsRef.current);
    }

    if(goingForwardRef.current){
      observer.observe(goingForwardRef.current);
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
      guideRef.current, whatIsRef.current, formData, sensitivity, epsilon, noiseType]);

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
                         finalOutput,setFinalOutput,
                         qboxRef,pageNo,setPageNo,
                         pageLoaded,setPageLoaded,
                         pageMeta,setPageMeta,
                         pageMetaRef};

  return (
    <contexts.App.provider value={contextValues}>
      <div ref={pages} style={{ height: '100%',width: '100%'}}>
          <Qbox />
          <div className='progressbar'></div>
          <Sidebar />
          <div className='page1'
              style={{ position:'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={whatIsRef} className='offsetBox'></div>
                <div className='box'>
                  <PageOne/>
                </div>
              {/* style={{ height: '100%',width: '100%',backgroundColor: '#3d958c',padding: '0',borderBottom:'solid'}}> */}
          </div>
          <div className='page2' 
              style={{ position:'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={whatIsRef} className='offsetBox'></div>
                <div className='box'>
                  <WhatIs/>
                </div>
          </div>
          <div className='page3' 
              style={{ position:'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={guideRef} className='offsetBox'></div>
                <div className='box'>
                  <Guide/>
                </div>
          </div>
          <div className='form show getHeight'  
              style={{ position: 'relative', height: '100%',width: '100%',backgroundColor:'#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={formRef} className='offsetBox'></div>
                <div className='box'>
                  <HealthSurveyForm />
                </div>
          </div>
          <div className='submittedData hide getHeight'  
              style={{position: 'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF', padding: '0',borderBottom:'solid'}}>
                <div ref={submittedDataRef} className='offsetBox'></div>
                <div className='box'>
                  {Object.entries(submittedData).length != 0 &&
                    <IntermediateResults/>}
                </div>
          </div>
          <div className='finalOutput hide getHeight'
              style={{position: 'relative',height: '100%',width: '100%',backgroundColor: '#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={finalOutputRef} className='offsetBox'></div>
                <div className='box'>
                    {Object.entries(finalOutput).length != 0 &&
                      <FinalOutput />}
                </div>
          </div>
          <div className='form goingForward'  
              style={{ display: 'none',position: 'relative', height: '100%',width: '100%',backgroundColor:'#ADEFD1FF',padding: '0',borderBottom:'solid'}}>
                <div ref={goingForwardRef} className='offsetBox'></div>
                <div className='box'>
                  <GoingForward/>
                </div>
          </div>
      </div>
    </contexts.App.provider>
  );
};

export default App;

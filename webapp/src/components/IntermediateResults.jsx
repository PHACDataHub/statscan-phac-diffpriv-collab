import React,{useEffect,useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SurveyResults from "../components/SurveyResults";
import LaplaceDistPlot from './LaplaceDistPlot';
import EpsilonSensitivitySliders from './EpsilonSensitivitySliders';
import Dropdown from './Dropdown';
import { classNames,pageNumbers } from '../initialStates';
import { contexts } from '../contexts/AppContext';
import { navigateToPage } from '../utility/general';

function IntermediateResults() {
  const { pageLoaded,setPageLoaded,sensitivity,epsilon,pageMeta,setPageMeta,pageMetaRef } = useContext(contexts.App.context);
  let b = (Math.round((sensitivity/epsilon)*100)/100);
  b = b >= 10 ? b.toFixed(1) : b.toFixed(2);
  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(() => {
    let smallScreen = !(innerHeight > 720);
    let pageMetaCopy = JSON.parse(JSON.stringify(pageMeta));
    const pageNumber = pageNumbers['intermediate'];
    pageMetaRef.current[pageNumber].showQBox = true;
    pageMetaRef.current[pageNumber].smallScreen = smallScreen;
    // pageMetaRef.current = pageMetaCopy;
    // setPageMeta((prevPageMeta) => { return { ...prevPageMeta, [pageNumber] : { ...prevPageMeta[pageNumber], ["smallScreen"] : smallScreen }}});
    if(pageLoaded)
      window.scrollTo({top:height*(pageNumbers["intermediate"]-1),behavior: "smooth"});
    }, []);

  const big = innerHeight < 850 ? false :true;
  const style = big ? {padding:'50px', paddingRight:'100px', 
                       border: '4px solid #00203f',borderRadius: '2px 30px', borderStyle:'inset'} : {};
  return (
    <Container fluid className="custom-container"
                          style={style}>
        {(innerHeight > 720) && 
        <Row>
          <Col style={{color:'rgb(0, 32, 63)'}}>
            <h1><b>Step 2:</b></h1> 
            <p>
            Here, we showcase how a user response can be privatized with LDP by adding noise to the data (as depicted in <b onClick={()=>navigateToPage('page2')}><u>image</u></b>).
            The table below shows the user's response before and after noise is applied to it.
            The graph on the right presents the distribution being used to add noise to the initial response, based on the Laplace or Gaussian distribution selected from the corresponding dropdown. 
            This distribution is where the noise values added to the response are sampled from. 
            The tightness and spread of the distribution are controlled by the Sensitivity and Epsilon(ε) sliders which ultimatley govern the probabilty of getting lower/higher noise values. 
            The <b>Confirm Changes</b> button takes the noised values from the table and passes it onto the next section.
            Click on the bottom right question box for more details.
            </p>
          </Col>
        </Row>
        }
        <Row>
            <Col xs={8}>
              <SurveyResults className="intermediateresults"/>
            </Col>
            <Col xs={4}>
              <Dropdown />
              <br></br>
              <LaplaceDistPlot />
              <div style={{display: 'flex',justifyContent: 'space-evenly',alignItems: 'center'}}>
                <div style={{fontSize:'x-large'}}>b</div>
                <div style={{fontSize:'x-large'}}>=</div>
                <EpsilonSensitivitySliders />
                <div style={{fontSize:'x-large'}}>=</div>
                <div style={{fontSize:'x-large'}}>{b == Infinity ? 'Ꝏ' : b}</div>
              </div>
            </Col>
        </Row>
    </Container> 
  )
}

export default IntermediateResults
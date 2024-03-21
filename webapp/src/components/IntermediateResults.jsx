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
  const { pageLoaded,setPageLoaded,sensitivity,epsilon,pageMeta,setPageMeta } = useContext(contexts.App.context);
  let b = (Math.round((sensitivity/epsilon)*100)/100);
  b = b >= 10 ? b.toFixed(1) : b.toFixed(2);
  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(() => {
    let smallScreen = false;
    let pageMetaCopy = pageMeta;
    const pageNumber = pageNumbers["intermediate"];
    setPageMeta((prevPageMeta) => { return { ...prevPageMeta, [pageNumber] : { ...prevPageMeta[pageNumber], ["smallScreen"] : smallScreen }}});
    if(pageLoaded)
      window.scrollTo({top:height*(pageNumbers["intermediate"]-1),behavior: "smooth"});
    }, []);

  return (
    <Container fluid className="custom-container"
                          style={{padding:'50px', paddingRight:'100px', 
                                  border: '4px solid #00203f',borderRadius: '2px 30px', borderStyle:'inset'}}>
        <Row>
          <Col style={{color:'rgb(0, 32, 63)'}}>
            <h1><b>Step 2:</b></h1> 
            <p>
            This section showcases the process of converting raw(private) data into privatized data by the addition of noise, as depicted in the <b onClick={()=>navigateToPage('page2')}><u>image</u></b>.
            The table shows the raw form values vs the noised privatized values. The graph contains a noise distribution which changes based on the kind of noise - Laplace or Gaussian being selcted from the dropdown. 
            This distribution is from where the noise values are sampled and then applied to the orignal form input. 
            The tightness and spread of the distribution are controlled by the Sensitivity and Epsilon(ε) sliders which ultimatley govern the probabilty of getting lower/higher noise values. A much detailed explanation can be found in the question box.
            </p>
          </Col>
        </Row>
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
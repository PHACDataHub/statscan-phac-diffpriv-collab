import React,{useEffect,useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SurveyResults from "../components/SurveyResults";
import LaplaceDistPlot from './LaplaceDistPlot';
import EpsilonSensitivitySliders from './EpsilonSensitivitySliders';
import Dropdown from './Dropdown';
import { classNames,pageNumbers } from '../initialStates';
import { contexts } from '../contexts/AppContext';

function IntermediateResults() {
  const { pageLoaded,setPageLoaded,sensitivity,epsilon } = useContext(contexts.App.context);
  let b = (Math.round((sensitivity/epsilon)*100)/100);
  b = b >= 10 ? b.toFixed(1) : b.toFixed(2);
  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

    useEffect(() => {
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
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
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
import React,{useEffect,useContext} from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import SurveyResults from "../components/SurveyResults";
import LaplaceDistPlot from './LaplaceDistPlot';
import EpsilonSensitivitySliders from './EpsilonSensitivitySliders';
import Dropdown from './Dropdown';
import { classNames } from '../initialStates';
import { contexts } from '../contexts/AppContext';

function IntermediateResults() {
  const { sensitivity,epsilon } = useContext(contexts.App.context);
  let b = (Math.round((sensitivity/epsilon)*100)/100);
  b = b >= 10 ? b.toFixed(1) : b.toFixed(2);
  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

    useEffect(() => {
      window.scrollTo({top:height*2,behavior: "smooth"});
    }, []);
  return (
    <Container fluid className="custom-container">
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
import React,{useEffect} from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import SurveyResults from "../components/SurveyResults";
import LaplaceDistPlot from './LaplaceDistPlot';
import EpsilonSensitivitySliders from './EpsilonSensitivitySliders';
import Dropdown from './Dropdown';
import { classNames } from '../initialStates';

function IntermediateResults() {
    const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

    useEffect(() => {
      window.scrollTo({top:height*2,behavior: "smooth"});
  }, []);
  return (
    <Container fluid className="custom-container">
        <Row>
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
    </Container> 
  )
}

export default IntermediateResults
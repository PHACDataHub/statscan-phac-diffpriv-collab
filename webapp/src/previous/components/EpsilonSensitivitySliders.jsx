import React from 'react';
import Slider from './Slider';
import { EPSILON,SENSITIVITY } from '../utility/constants';
import { Container, Row, Col, Form } from 'react-bootstrap';

function EpsilonSensitivitySliders() {
  return (
    <Container>
        <Row>
            <Col>
                <Slider type={SENSITIVITY}/>
                <svg height="1">
                    <line x1="0" y1="0" x2="140px" y2="0" stroke="black" strokeWidth="30px" />
                </svg>
                <Slider type={EPSILON}/>
            </Col>
        </Row>
    </Container>
  )
}

export default EpsilonSensitivitySliders
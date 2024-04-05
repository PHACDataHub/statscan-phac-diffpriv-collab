import React,{useContext} from 'react';
import Slider from './Slider';
import { EPSILON,SENSITIVITY } from '../utility/constants';
import { Container, Row, Col, Form } from 'react-bootstrap';

function EpsilonSensitivitySliders() {
  
  return (
    <div style={{display: 'flex',justifyContent: 'space-evenly',alignItems: 'center'}}>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly"}}>
          <Slider type={SENSITIVITY}/>
          <svg height="1" width="100">
              <line x1="0" y1="0" x2="100px" y2="0" stroke="black" strokeWidth="30px" />
          </svg>
          <Slider type={EPSILON}/>
      </div>

    </div>
)}

export default EpsilonSensitivitySliders
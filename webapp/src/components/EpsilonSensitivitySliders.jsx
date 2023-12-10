import React from 'react';
import { contexts } from '../contexts/AppContext';
import Slider from './Slider';
import { EPSILON,SENSITIVITY } from '../utility/constants';

function EpsilonSensitivitySliders() {
  return (
    <div>
        <Slider type={EPSILON}/>
        <Slider type={SENSITIVITY}/>
    </div>
  )
}

export default EpsilonSensitivitySliders
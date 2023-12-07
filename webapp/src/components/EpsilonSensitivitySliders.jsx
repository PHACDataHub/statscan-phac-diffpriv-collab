import React from 'react';
import { contexts } from '../contexts/AppContext';
import Slider from './Slider';
import { EPSILON,SENSITIVITY } from '../utility/constants';

function EpsilonSensitivitySliders() {
  return (
    <div>
        <contexts.Slider.provider value={{type:EPSILON}}>
            <Slider />
        </contexts.Slider.provider>
        <contexts.Slider.provider value={{type:SENSITIVITY}}>
            <Slider />
        </contexts.Slider.provider>
    </div>
  )
}

export default EpsilonSensitivitySliders
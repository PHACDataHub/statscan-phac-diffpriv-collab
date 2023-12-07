import React, { useContext } from 'react'
import { contexts } from '../contexts/AppContext';
import { EPSILON,SENSITIVITY } from '../utility/constants';

function Slider() {
  const { epsilon,setEpsilon,sensitivity,setSensitivity,max_min_step } = useContext(contexts.App.context);
  const { type } = useContext(contexts.Slider.context);

  const handleChange = function(e){
    console.log(type);
    if(type == EPSILON){
      setEpsilon(e.target.valueAsNumber);
    }
    else{
      setSensitivity(e.target.valueAsNumber);
    }
  }

  return (
    <div>
      <input id={type} type="range" min={max_min_step[type][0]} max={max_min_step[type][1]} step={max_min_step[type][2]} value = {type === EPSILON ? epsilon : sensitivity} onChange={handleChange}/>
      <p>{type} Value: {type === EPSILON ? epsilon : sensitivity}</p>
    </div>
  );
}

export default Slider
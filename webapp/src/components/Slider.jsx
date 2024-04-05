import React, { useContext } from 'react'
import { contexts } from '../contexts/AppContext';
import { EPSILON,SENSITIVITY } from '../utility/constants';

function Slider({ type }) {
  const { submittedData,epsilon,setEpsilon,sensitivity,setSensitivity,max_min_step } = useContext(contexts.App.context);

  const handleChange = function(e){
    if(type == EPSILON){
      setEpsilon(e.target.valueAsNumber);
    }
    else{
      setSensitivity(e.target.valueAsNumber);
    }
  }

  const disabled = Object.keys(submittedData).length === 0 ? true : false;
  const showEpsilon = type === EPSILON ? { display : "flex" } : { display : "none" }
  const showSensitivity = type === SENSITIVITY ? { display : "flex" } : { display : "none" }
  return (
    <div>
      <section style = { showEpsilon }>{EPSILON} : {epsilon}</section>
      <input id={type} type="range" min={max_min_step[type][0]} max={max_min_step[type][1]} 
              step={max_min_step[type][2]} value = {type === EPSILON ? epsilon : sensitivity} 
              onChange={handleChange} disabled={disabled} style={{width:'120px'}}/>
      <section style = { showSensitivity }>{SENSITIVITY} : {sensitivity}</section>
    </div>
  );
}

export default Slider

import React, { useState, useEffect, useContext } from 'react';
import { CopyBlock, dracula } from "react-code-blocks";
import { contexts } from '../contexts/AppContext';
import Button from 'react-bootstrap/Button';

function FinalOutput() {
  let { finalOutput } = useContext(contexts.App.context);

  finalOutput = JSON.stringify(finalOutput).replaceAll(",",",\n")
                                           .replaceAll("{","{\n")
                                           .replaceAll("}","\n}")
                                           .replaceAll(":","  :  ")

  useEffect(()=>{
    window.scrollTo({top:document.getElementsByClassName("fade")[2].offsetTop,behavior:"smooth"});
  },[]);

  const backToForm = () => {
    window.scrollTo({top:document.getElementsByClassName("fade")[0].offsetTop,behaviour:"smooth"});
  }

  const tuneNoise = () => {
    window.scrollTo({top:document.getElementsByClassName("fade")[1].offsetTop,behaviour:"smooth"});
  }
  return (
    <div>
        <CopyBlock
          language={"javascript"}
          text={finalOutput}
          showLineNumbers={true}
          theme={dracula}
          wrapLines={true}
          codeBlock
        />   
        <Button type="button" variant="primary" size="lg" active onClick={backToForm}>
          Back To Form
        </Button>
        <Button type="button" variant="primary" size="lg" active onClick={tuneNoise}>
          Back to Tuning Noise
        </Button>
    </div>
  )
}

export default FinalOutput
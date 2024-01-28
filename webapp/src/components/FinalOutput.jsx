import React, { useState, useEffect, useContext } from 'react';
import { CopyBlock, dracula } from "react-code-blocks";
import { Container, Row, Col} from 'react-bootstrap';
import { contexts } from '../contexts/AppContext';
import Button from 'react-bootstrap/Button';
import { classNames } from '../initialStates';

function FinalOutput() {
  let { finalOutput } = useContext(contexts.App.context);

  finalOutput = JSON.stringify(finalOutput).replaceAll(",",",\n\t")
                                           .replaceAll("{","{\n\t")
                                           .replaceAll("}","\n}")
                                           .replaceAll(":","  :  ")

  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(()=>{
    window.scrollTo({top:height*3,behavior:"smooth"});
  },[]);

  const backToForm = () => {
    window.scrollTo({top:height,behavior:"smooth"});
  }

  const tuneNoise = () => {
    window.scrollTo({top:height*2,behaviour:"smooth"})
  }
  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} md={12} lg={12}>
          <CopyBlock
            language={"javascript"}
            text={finalOutput}
            showLineNumbers={true}
            theme={dracula}
            wrapLines={true}
            codeBlock
          />   
          </Col>
        </Row>
        <br></br>
        <div className="d-grid gap-2">
            <Button type="button" variant="warning" size="lg" active onClick={tuneNoise}>
              Back to Tuning Noise ⬆
            </Button>
            {/* <Button type="button" variant="primary" size="lg" active onClick={backToForm}>
              Back To Form
            </Button> */}
        </div>
      </Container>
    </div>
  )
}

export default FinalOutput
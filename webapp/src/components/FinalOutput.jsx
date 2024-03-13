import React, { useState, useEffect, useContext } from 'react';
import { CopyBlock, dracula } from "react-code-blocks";
import { Container, Row, Col} from 'react-bootstrap';
import { contexts } from '../contexts/AppContext';
import Button from 'react-bootstrap/Button';
import { classNames } from '../initialStates';
import { pageNumbers } from '../initialStates';

function FinalOutput() {
  let { finalOutput,pageLoaded,setPageLoaded } = useContext(contexts.App.context);

  let finalOutputParsed = JSON.stringify(finalOutput).replaceAll(",",",\n\t")
                                           .replaceAll("{","{\n\t")
                                           .replaceAll("}","\n}")
                                           .replaceAll(":","  :  ")

  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(()=>{
    if(pageLoaded)
      window.scrollTo({top:height*(pageNumbers["finalResults"]-1),behavior:"smooth"});
    else{
      setPageLoaded(true);
    }
  },[]);

  const backToForm = () => {
    window.scrollTo({top:height*(pageNumbers["surveyForm"]-1),behavior:"smooth"});
  }

  const tuneNoise = () => {
    window.scrollTo({top:height*(pageNumbers["intermediate"]-1),behaviour:"smooth"})
  }

  const download = (type) => {
    console.log(type);
    let link = '';
    let extension = '';
    let content = [];
    if(type === 'json'){
      content.push(JSON.stringify(finalOutput));
      extension = 'json';
    }
    else if(type === 'csv'){
      const keys = Object.keys(finalOutput);
      const values = Object.values(finalOutput);
      const headerString = keys.join(',');
      const valueString = values.join(',');
      const csv = [headerString,valueString].join('\r\n');
      content.push(csv);
      extension = 'csv';
    }
      let blob = new Blob(content, { type: "text/plain;charset=utf-8" });
      let url = window.URL || window.webkitURL;
      link = url.createObjectURL(blob);
      let a = document.createElement("a");
      a.download = `payload.${extension}`;
      a.href = link;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} md={12} lg={12}>
          <CopyBlock
            language={"javascript"}
            text={finalOutputParsed}
            showLineNumbers={true}
            theme={dracula}
            wrapLines={true}
            codeBlock
          />   
          </Col>
        </Row>
        <Row style={{paddingTop:'7px',paddingBottom:'7px'}}>
          <Col xs={6} md={6} lg = {6} style={{paddingRight:'3px'}}>
            <div className="d-grid">
                <Button type="button" variant="success" size="lg" active onClick={() => download('json')}>
                  Download as .JSON
                </Button>
            </div>
          </Col>
          <Col xs={6} md={6} lg = {6} style={{paddingLeft:'3px'}}>
            <div className="d-grid">
                <Button type="button" variant="success" size="lg" active onClick={() => download('csv')}>
                  Download as .CSV
                </Button>
            </div>
          </Col>
        </Row>
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
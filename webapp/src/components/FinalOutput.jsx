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
    <div className="panel large-panel" style={{backgroundColor: '#ADEFD1FF',color: 'white', padding: '50px',
                                              border: '4px solid #00203f',borderRadius: '2px 30px', borderStyle:'inset'}}>
      <Container fluid>
        <Row>
          <Col style={{color:'rgb(0, 32, 63)'}}>
            <h1><b>Step 3:</b></h1> 
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>
          </Col>
        </Row>
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
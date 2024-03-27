import React, { useState, useEffect, useContext } from 'react';
import { CopyBlock, dracula } from "react-code-blocks";
import { Container, Row, Col} from 'react-bootstrap';
import { contexts } from '../contexts/AppContext';
import Button from 'react-bootstrap/Button';
import { classNames } from '../initialStates';
import { pageNumbers } from '../initialStates';
import { navigateToPage } from '../utility/general';

function FinalOutput() {
  let { finalOutput,pageLoaded,setPageLoaded,pageMeta,setPageMeta,pageMetaRef } = useContext(contexts.App.context);

  let finalOutputParsed = JSON.stringify(finalOutput).replaceAll(",",",\n\t")
                                           .replaceAll("{","{\n\t")
                                           .replaceAll("}","\n}")
                                           .replaceAll(":","  :  ")

  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(()=>{
    let smallScreen = !(innerHeight > 720);
    let pageMetaCopy = JSON.parse(JSON.stringify(pageMeta));
    const pageNumber = pageNumbers['finalResults'];
    pageMetaRef.current[pageNumber].showQBox = smallScreen;
    pageMetaRef.current[pageNumber].smallScreen = smallScreen;
    // pageMetaRef.current = pageMetaCopy;
    // setPageMeta((prevPageMeta) => { return { ...prevPageMeta, [pageNumber] : { ...prevPageMeta[pageNumber], ["smallScreen"] : smallScreen , ["showQBox"] : smallScreen }}});
    // setPageMeta((prevPageMeta) => { return { ...prevPageMeta, [pageNumber] : { ...prevPageMeta[pageNumber], ["showQBox"] : smallScreen }}});
    // qboxRef.current.style.display = smallScreen ? 'block' : 'none';
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

  const big = innerHeight < 850 ? false :true;
  let style = {backgroundColor : "#adefd1ff", color: "white"};
  style = big ? {...style,padding:'50px', paddingRight:'100px', 
                       border: '4px solid #00203f',borderRadius: '2px 30px', borderStyle:'inset'} : {...style};

  return (
    <div className="large-panel" style={style}>
      <Container fluid>
        {(innerHeight > 720) && 
        <Row>
          <Col style={{color:'rgb(0, 32, 63)'}}>
            <h1><b>Step 3:</b></h1> 
            <p>
              The data shown below is a JSON representation of the privatized data, that is ready for use. The noise adjustment done in the previous step adds plausible
              deniability to it. This step depicts the part of the <b onClick={()=>navigateToPage('page2')}><u>image</u></b> where the privatized data is ready to be transferred
              from the data producer to the untrusted data curator. The data can be downloaded locally either in JSON or CSV formats.
            </p>
          </Col>
        </Row>
        }
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
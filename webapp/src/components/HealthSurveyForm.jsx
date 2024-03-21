import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import Form from 'react-bootstrap/Form';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { contexts } from '../contexts/AppContext';
import { pageNumbers } from '../initialStates';

const HealthSurveyForm = () => {
  const { formData,setFormData,
          handleFormSubmit,handleFormReset,
          submitted,setSubmitted,setFilledAndValid,
          pageMeta,setPageMeta } = useContext(contexts.App.context);

  const validateInput = (name, value) => {
    const { range,performIntegerCheck,type } = formData[name];
    let isInteger = true;
    if(value == '' || type == 'select')
      return true;
    const val = Number(value);
    if(performIntegerCheck)    
      isInteger = Number.isInteger(val)
    if(val >= range[0] && val <= range[1] && isInteger)
      return true;
    return false;
  }

  const isFormFilledAndValid = (data) => {
      let filledAndValid = true;
      Object.entries(data).map(el => {
        const [ Key,Value ] = el;
        data[Key].border = (Value.value === '' || !validateInput(Key,Value.value)) ? true : false;
        if(filledAndValid)
          filledAndValid = !data[Key].border;
      }); 
      return filledAndValid;
  }

  const randomizeFormData = (e) => {
    const copiedFormData = JSON.parse(JSON.stringify(formData));
    Object.entries(copiedFormData).map(el => {
      const [ Key,Value ] = el;
      const { range,type,performIntegerCheck,values } = Value;
      if(type == 'number'){
        const [ min,max ] = range;
        let randomNumber = Math.round(((Math.random() * (max + 1 - min)) + min) * 100) / 100;
        if(performIntegerCheck || randomNumber > max)
          randomNumber = Math.floor(randomNumber);
        Value.value = randomNumber;
      }
      else{
        const min = 1;
        const max = values.length;
        const randomNumber = Math.floor((Math.random() * (max - min)) + min);
        Value.value = values[randomNumber].value;
      }
      Value.border = false;
    });
    setFormData(copiedFormData);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isValid = validateInput(name,value);
    const copiedFormData = JSON.parse(JSON.stringify(formData));
    copiedFormData[name]["value"] = value;
    const formFilledAndValid = isFormFilledAndValid(copiedFormData);
    setFormData((prevFormData) => { return { ...prevFormData, [name] : { ...prevFormData[name], ["value"] : value , ["border"] : !isValid ? true : false}} })
    if(submitted > 0){
        setFilledAndValid(formFilledAndValid);
        setFormData((prevFormData) => { return { ...prevFormData, [name] : { ...prevFormData[name], ["border"] : (value == '' || !isValid) ? true : false }} })
    }
  };

  useEffect(() => {
    //handle small screen sizes
    let smallScreen = true;
    let pageMetaCopy = pageMeta;
    const pageNumber = pageNumbers['surveyForm'];
    setPageMeta((prevPageMeta) => { return { ...prevPageMeta, [pageNumber] : { ...prevPageMeta[pageNumber], ["smallScreen"] : smallScreen }}});
  },[]);

  useEffect(() => {
    if(submitted > 0){
      const copiedFormData = JSON.parse(JSON.stringify(formData));
      const filledAndValid = isFormFilledAndValid(copiedFormData);
      const whichFunc = filledAndValid == true ? handleFormSubmit : setFormData;
      setFilledAndValid(filledAndValid);
      whichFunc(copiedFormData);
    }
  }, [submitted]);

  const submitForm = (e) => {
    if(e){
      e.preventDefault();
    }
    setSubmitted((prevSubmit) => prevSubmit + 1);
  }

  const formGenerator = (formState) => { 
    return Object.entries(formState).map(el => {
      const [ Key,Value ] = el;
      const border = Value.border ? { border : "solid", borderColor : "red" } : { border : "none" };
      const className = Value.border ? "border-danger border-2" : "" ;
      if(Value.type == "number"){
        return <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column xs="7" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col >
                    <Form.Control type={Value.type} key={Value} name={Key} value={Value.value} onChange={handleChange} className={className} />
                  </Col>
                </Form.Group>
      }
      else if(Value.type == "select"){
        return  <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column xs="7" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col >
                    <Form.Select name={Key} value={Value.value} onChange={handleChange} className={className}>
                      { Value.values.map(el => <option key={el.label} value={el.value}>{el.label}</option>) }
                    </Form.Select>
                  </Col>
                </Form.Group>
      }
    })
  }  

  const big = innerHeight <= 900 ? false : true;
  console.log(big);
  const style = {padding:'50px', border: '4px solid #00203f',
           borderRadius: '2px 30px', borderStyle:'inset'};
  style['padding'] = big ? '50px' : '10px';

  return (
      <Container fluid className="custom-container" 
                        style={style}>
        {(innerHeight >= 720) && 
        <Row>
          <Col style={{color:'rgb(0, 32, 63)'}}>
            <h1><b>Step 1:</b></h1> 
            <p>
              Below is a simulation of a survey form that collects health data. The form loads with prefilled random values and the fields shown below are either discrete or
              continuous. The type and range of accepted values are shown in the
              question box at the bottom right of the screen.  The <b>RESET</b> button clears out any filled values. The <b>RANDOMIZE</b> button populates the fields randomly.
              The <b>SUBMIT</b> button captures the form values and passes it onto the Noise Tuning section. Fields get highlighted
              in red if they are not within the correct range.
            </p>
          </Col>
        </Row>
        }                
        <Row>
          <Col sm={12} md={12} lg={12}>
            <div className="panel large-panel" style={{backgroundColor: '#00203f',color: 'white',border: 'solid white',borderRadius:'10px'}}>
              <div style={{height:'80%'}}>
                <h3>Health Survey Form</h3>
                <Form className='healthSurveyForm'/*onSubmit={submitForm}*/>
                  {
                    formGenerator(formData)
                  }
                  <ButtonGroup aria-label="Basic example">
                    <Button id="submitFormData" variant="outline-success" size="md" active onClick={submitForm}>
                      Submit
                    </Button>
                    <Button id="resetFormData" type="button" variant="outline-warning" size="md" active onClick={handleFormReset}>
                      Reset
                    </Button>
                    <Button id="randomizeFormData" type="button" variant="outline-info" size="md" active onClick={randomizeFormData}>
                      Randomize
                    </Button>
                  </ButtonGroup>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default HealthSurveyForm;

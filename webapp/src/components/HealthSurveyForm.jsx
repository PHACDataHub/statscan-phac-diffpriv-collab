import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { contexts } from '../contexts/AppContext';

const HealthSurveyForm = () => {
  const { formData,setFormData,handleFormSubmit,handleFormReset,submitted,setSubmitted,setFilledAndValid } = useContext(contexts.App.context);

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
    if(submitted > 0){
      const copiedFormData = JSON.parse(JSON.stringify(formData));
      const filledAndValid = isFormFilledAndValid(copiedFormData);
      const whichFunc = filledAndValid == true ? handleFormSubmit : setFormData;
      setFilledAndValid(filledAndValid);
      whichFunc(copiedFormData);
    }
  }, [submitted]);

  const submitForm = (e) => {
    e.preventDefault();
    setSubmitted((prevSubmit) => prevSubmit + 1);
  }

  const formGenerator = (formState) => { 
    return Object.entries(formState).map(el => {
      const [ Key,Value ] = el;
      const border = Value.border ? { border : "solid", borderColor : "red" } : { border : "none" };
      const className = Value.border ? "border-danger border-2" : "" ;
      if(Value.type == "number"){
        return <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column sm="4" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col sm="5" >
                    <Form.Control type={Value.type} key={Value} name={Key} value={Value.value} onChange={handleChange} className={className} />
                  </Col>
                </Form.Group>
      }
      else if(Value.type == "select"){
        return  <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column sm="4" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col sm="5" >
                    <Form.Select name={Key} value={Value.value} onChange={handleChange} className={className}>
                      { Value.values.map(el => <option key={el.label} value={el.value}>{el.label}</option>) }
                    </Form.Select>
                  </Col>
                </Form.Group>
      }
    })
  }  

  return (
    <div>
      <h3>Health Survey Form</h3>
      <Form /*onSubmit={submitForm}*/>
        {
          formGenerator(formData)
        }
        <Button type="button" variant="primary" size="lg" active onClick={submitForm}>
          Submit
        </Button>
        <Button type="button" variant="secondary" size="lg" active onClick={handleFormReset}>
          Reset
        </Button>
        <Button type="button" variant="secondary" size="lg" active onClick={randomizeFormData}>
          Randomize
        </Button>
      </Form>
    </div>
  );
};

export default HealthSurveyForm;

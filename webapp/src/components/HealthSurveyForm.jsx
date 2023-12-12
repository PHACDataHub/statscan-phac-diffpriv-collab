import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { contexts } from '../contexts/AppContext';

const HealthSurveyForm = () => {
  const { formData,setFormData,handleFormSubmit,handleFormReset,submitted,setSubmitted } = useContext(contexts.App.context);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => { return { ...prevFormData, [name] : { ...prevFormData[name], ["value"] : value }} })
    if(submitted > 0)
      setFormData((prevFormData) => { return { ...prevFormData, [name] : { ...prevFormData[name], ["border"] : value == '' ? true : false }} })
  };

  useEffect(() => {
    if(submitted > 0){
      let filled = true;
      const copiedFormData = JSON.parse(JSON.stringify(formData));
      Object.entries(copiedFormData).map(el => {
        const [ Key,Value ] = el;
        if(filled)
          filled = Value.value == '' ? false : true;
        copiedFormData[Key].border = Value.value == '' ? true : false;
      });
      const whichFunc = filled == true ? handleFormSubmit : setFormData;
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
      const border = Value.border ? { border : "solid", borderColor : "red" } : { border : "none" }
      if(Value.type == "number"){
        return <label key={Key} style={ border }>{Value.label}
                <input
                  type={Value.type}
                  key={Value}
                  name={Key}
                  value={Value.value}
                  onChange={handleChange}
                />
                </label>
      }
      else if(Value.type == "select"){
        return <label key={Key} style = { border }>{Value.label}
                <select
                  name={Key}
                  value={Value.value}
                  onChange={handleChange}
                >
                  { Value.values.map(el => <option key={el.label} value={el.value}>{el.label}</option>) }
                </select>
              </label>
      }
    })
  }  

  const formGenerator2 = (formState) => { 
    return Object.entries(formState).map(el => {
      const [ Key,Value ] = el;
      const border = Value.border ? { border : "solid", borderColor : "red" } : { border : "none" }
      if(Value.type == "number"){
        return <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column sm="4" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col sm="5" style = { border }>
                    <Form.Control type="number" key={Value} name={Key} value={Value.value} onChange={handleChange}/>
                  </Col>
                </Form.Group>
      }
      else if(Value.type == "select"){
        return  <Form.Group as={Row} className="mb-1" key={Key+Value.type}>
                  <Form.Label column sm="4" key = {Key}>
                    {Value.label}
                  </Form.Label>
                  <Col sm="5" style = {border}>
                    <Form.Select name={Key} value={Value.value} onChange={handleChange}>
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
      <Form onSubmit={submitForm}>
        {
          formGenerator2(formData)
        }
        <Button type="submit" variant="primary" size="lg" active>
          Submit
        </Button>
        <Button type="button" variant="secondary" size="lg" active onClick={handleFormReset}>
          Reset
        </Button>
      </Form>
    </div>
  );
};

export default HealthSurveyForm;

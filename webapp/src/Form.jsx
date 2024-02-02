import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useFormContext } from './FormContext';
import CoinFlip from './CoinFlip';
import './App.css';

const selectValue = (values, probabilities) => {
  const totalProbability = probabilities.reduce((acc, prob) => acc + prob, 0);
  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;

  for (let i = 0; i < values.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue < cumulativeProbability) {
      return values[i];
    }
  }

  // This should not happen, but return the last value as a fallback
  return values[values.length - 1];
};

const generateRandomData = (formState) => {
  const copiedFormState = { ...formState };

  Object.entries(copiedFormState).forEach(([key, field]) => {
    const { values } = field;
    let probabilities;

    switch (key) {
      case 'exerciseIntensity':
        probabilities = [0.3, 0.2, 0.1, 0.15, 0.1, 0.05, 0.05, 0.05];
        break;
      case 'exerciseSessionLength':
        probabilities = [0.3, 0.2, 0.1, 0.15, 0.1, 0.05, 0.05, 0.05];
        break;
      case 'hoursOfSleep':
        probabilities = [0.1, 0.2, 0.2, 0.3, 0.15, 0.05];
        break;
      case 'bmi':
        probabilities = [0.05, 0.25, 0.3, 0.2, 0.2];
        break;
      default:
        probabilities = Array(values.length).fill(1 / values.length);
        break;
    }

    const randomValue = selectValue(values.slice(1).map((v) => v.value), probabilities);
    copiedFormState[key].value = randomValue;

    // Debugging output
    console.log(`Field: ${key}, Chosen Value: ${randomValue}, Probabilities: ${probabilities}`);
  });

  return copiedFormState;
};

const Form = () => {
  const { state, submitForm } = useFormContext();
  const { formSubmissions, counts } = state;
  const [formState, setFormState] = useState(initFormState);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    submitForm(formState);
    setFormState(initFormState);
  };

  const generateAndFillTable = () => {
    const generatedData = Array(1000).fill().map(() => generateRandomData(initFormState));
    generatedData.forEach((data) => submitForm(data));
  };

	return (
    <div className="custom-container">
      <div className="panel large-panel">
        <form onSubmit={handleFormSubmit}>
          {Object.keys(formState).map((fieldName) => (
            <div key={fieldName}>
              <label>{formState[fieldName].label}</label>
              <select
                value={formState[fieldName].value}
                onChange={(e) =>
                  setFormState((prevFormState) => ({
                    ...prevFormState,
                    [fieldName]: {
                      ...prevFormState[fieldName],
                      value: e.target.value,
                    },
                  }))
                }
              >
                {formState[fieldName].values.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
        <button onClick={generateAndFillTable}>Generate and Fill Table</button>
        <CoinFlip
          formSubmissions={formSubmissions}
          setFormSubmissions={submitForm} // Pass the submitForm function for updating form submissions
          formState={formState}
        />
      </div>

      <div className="scrollable-panel">
        <h2>Form Submissions</h2>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              {Object.keys(formState).map((fieldName) => (
                <th key={fieldName}>{formState[fieldName].label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formSubmissions.map((submission, index) => (
              <tr key={index}>
                {Object.keys(submission).map((fieldName) => (
                  <td key={fieldName}>
                    {typeof submission[fieldName].value === 'object'
                      ? submission[fieldName].value.label
                      : submission[fieldName].value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="scrollable-panel">
        <h2>Submission Counts</h2>
        <ul>
          {Object.entries(counts).map(([key, count]) => (
            <li key={key}>
              Combination: {key}, Count: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Form;

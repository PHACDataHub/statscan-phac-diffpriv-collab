import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { contexts } from '../contexts/AppContext';

const SurveyResults = () => {
  const { submittedData,noisyData,setFinalOutput } = useContext(contexts.App.context);

  const goBack = () => {
    window.scrollTo({top:document.getElementsByClassName("fade")[0].offsetTop});
  }

  const confirmChange = () => {
    setFinalOutput(noisyData);
    window.scrollTo({top:document.getElementsByClassName("fade")[2].offsetTop});
  }

  const renderTable = (idx, label, submittedValue, noisyValue) => (
        <tr key={label}>
          <th>{idx + 1}</th>
          <th>{submittedValue.label}</th>
          <th>{submittedValue.value}</th>
          <th>{noisyValue}</th>
        </tr>
  );

  return (
    <>
      <div className="panel small-panel">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Field</th>
              <th>Submitted Value</th>
              <th>Noisy Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(submittedData).map(([label, value],idx) =>
              renderTable(idx, label, value, noisyData[label])
            )}
          </tbody>
        </Table>
        <Button type="button" variant="primary" size="lg" active onClick={goBack}>
          Back To Form
        </Button>
        <Button type="button" variant="primary" size="lg" active onClick={confirmChange}>
          Confirm Changes
        </Button>
      </div>
    </>
  );
};

export default SurveyResults;

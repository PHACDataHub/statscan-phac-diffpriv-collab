import React, { useContext } from 'react';
import Table from 'react-bootstrap/Table';
import { contexts } from '../contexts/AppContext';

const SurveyResults = () => {
  const { submittedData,noisyData } = useContext(contexts.App.context);

  const renderSurveyResult = (label, submittedValue, noisyValue) => (
    <div key={label}>
      <strong>{submittedValue.label}:</strong> {submittedValue.value || ''}  || {noisyValue || ''}
    </div>
  );

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
      </div>
    </>
  );
};

export default SurveyResults;

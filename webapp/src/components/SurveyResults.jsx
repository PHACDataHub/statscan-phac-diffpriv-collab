import React, { useContext } from 'react';
import { contexts } from '../contexts/AppContext';

const SurveyResults = () => {
  const { submittedData,noisyData } = useContext(contexts.App.context);

  const renderSurveyResult = (label, submittedValue, noisyValue) => (
    <div key={label}>
      <strong>{label}:</strong> {submittedValue || ''}  || {noisyValue || ''}
    </div>
  );

  return (
    <>
      <div className="panel small-panel">
        <h3>Submitted || Noisy</h3>
        {Object.entries(submittedData).map(([label, value]) =>
          renderSurveyResult(label, value, noisyData[label])
        )}
      </div>

      { /* <div className="panel small-panel">
        <h3>Noisy Data</h3>
        {Object.entries(noisyData).map(([label, value]) =>
          renderSurveyResult(label, submittedData[label], value)
        )}
      </div> */ }
    </>
  );
};

export default SurveyResults;

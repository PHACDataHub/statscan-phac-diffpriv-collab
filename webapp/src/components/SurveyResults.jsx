import React, { useContext,useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { contexts } from '../contexts/AppContext';
import { classNames, pageNumbers } from '../initialStates';

const SurveyResults = () => {
  const { submittedData,noisyData,setFinalOutput,pageLoaded } = useContext(contexts.App.context);
  const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight);

  useEffect(()=>{
    if(!pageLoaded)
      document.getElementById("confirmChangesButton").click();
  },[])

  const goBack = () => {
    window.scrollTo({top:height * (pageNumbers['surveyForm']-1),behavior:"smooth"});
  }

  const confirmChange = () => {
    setFinalOutput(noisyData);
    document.getElementsByClassName('finalOutput')[0].classList.replace('hide','show');
    if(pageLoaded){
      window.scrollTo({top:height*(pageNumbers['finalResults']-1),behavior:"smooth"});
    }
  }

  const renderTable = (idx, label, submittedValue, noisyValue) => (
        <tr key={label}>
          <th>{idx + 1}</th>
          <th>{submittedValue.label.split("(")[0].split(":")[0]}</th>
          <th>{submittedValue.value}</th>
          <th>{noisyValue == Infinity ? 'Ꝏ' : (noisyValue == -Infinity ? '-Ꝏ' : noisyValue)}</th>
        </tr>
  );

  return (
      <div className="panel small-panel intermediateres">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Field</th>
              <th>Submitted</th>
              <th>Noised</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(submittedData).map(([label, value],idx) =>
              renderTable(idx, label, value, noisyData[label])
            )}
          </tbody>
        </Table>
        <Button id="confirmChangesButton" type="button" variant="success" size="md" active onClick={confirmChange}>
          Confirm Changes ✔
        </Button>
        {'\t'}
        <Button id="backToFormButton" type="button" variant="warning" size="md" active onClick={goBack}>
          Back To Form ⬆
        </Button>
      </div>
  );
};

export default SurveyResults;

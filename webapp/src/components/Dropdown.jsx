import React, { useContext,useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { contexts } from '../contexts/AppContext'
import { classNames } from '../initialStates';
import InputGroup from 'react-bootstrap/InputGroup';

function Dropdown() {

  const { noiseType,setNoiseType,submittedData } = useContext(contexts.App.context);
  const disabled = Object.keys(submittedData).length === 0 ? true : false;

  return (
    <div>
        <InputGroup className="mb-3" data-bs-theme="dark">
          <InputGroup.Text>Noise :</InputGroup.Text>
            <Form.Select
                value={noiseType}
                onChange={(e) => setNoiseType(e.target.value)}
                disabled={disabled}
            >
                <option value="laplace">Laplace</option>
                <option value="gaussian">Gaussian</option>
            </Form.Select>
        </InputGroup>
    </div>
  )
}

export default Dropdown
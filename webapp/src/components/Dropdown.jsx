import React, { useContext,useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { contexts } from '../contexts/AppContext'
import { classNames } from '../initialStates';

function Dropdown() {

  const { noiseType,setNoiseType,submittedData } = useContext(contexts.App.context);
  const disabled = Object.keys(submittedData).length === 0 ? true : false;

  return (
    <div>
        <Form.Group controlId="noiseTypeDropdown">
            <Form.Label>Noise Type :</Form.Label>
            <Form.Control
                as="select"
                value={noiseType}
                onChange={(e) => setNoiseType(e.target.value)}
                disabled={disabled}
            >
                <option value="laplace">Laplace Noise</option>
                <option value="gaussian">Gaussian Noise</option>
            </Form.Control>
        </Form.Group>
    </div>
  )
}

export default Dropdown
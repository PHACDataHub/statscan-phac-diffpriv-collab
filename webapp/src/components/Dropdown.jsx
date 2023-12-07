import React, { useContext } from 'react'
import { Form } from 'react-bootstrap'
import { contexts } from '../contexts/AppContext'

function Dropdown() {

  const { noiseType,setNoiseType } = useContext(contexts.App.context);

  return (
    <div>
        <Form.Group controlId="noiseTypeDropdown">
            <Form.Label>Noise Type</Form.Label>
            <Form.Control
                as="select"
                value={noiseType}
                onChange={(e) => setNoiseType(e.target.value)}
            >
                <option value="laplace">Laplace Noise</option>
                <option value="gaussian">Gaussian Noise</option>
            </Form.Control>
        </Form.Group>
    </div>
  )
}

export default Dropdown
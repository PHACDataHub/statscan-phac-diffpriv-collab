import React,{useEffect,useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { pageNumbers,classNames } from '../initialStates';
import { navigateToPage } from '../utility/general';
import { contexts } from '../contexts/AppContext';

function Guide() {
  const { submittedData,finalOutput } = useContext(contexts.App.context);
    const showHeader = innerHeight < 720 ? false : true;
    const style = {color:'#00203FFF',
                    padding:'50px',
                    border: '4px solid #00203f',
                    borderRadius: '2px 30px', borderStyle:'inset'};
    style['padding'] = showHeader ? '50px' : '10px';

    return (
        <Container fluid className="custom-container guide" style={style}>
            <Row>
            <Col>
                <h1>
                    <b>Contents of this Demo</b>
                </h1>
                <p>There are 3 sections that demonstrate the inner workings of Local Differential privacy :
                </p>
                <ul style={{listStyleType:'square'}}>
                    <li>
                    {showHeader &&
                        <h3><b onClick={()=>navigateToPage('surveyForm')}><u>Survey Form</u></b></h3>
                    }
                    <p>{!showHeader ?
                        <>The <b onClick={()=>navigateToPage('surveyForm')}><u>Survey Form</u></b></> :
                        <>This section</>
                    } simulates a sample Health Form that collects health data for a statistical survey. In a normal scenario the values would be sent 
                    to the server using a standard encryption protocol and then saved in the database. However in the case of Local DP,
                        the values are adjusted before they even leave the client's device, thus adding anonymity to the data <b>AT source</b>.
                    </p>
                    </li>
                    <li>
                    {showHeader &&
                        <h3><b onClick={()=>{if(Object.entries(submittedData).length != 0){navigateToPage('intermediate')}}}><u>Noise Tuning</u></b></h3>
                    }
                    <p>{!showHeader ?
                        <>The <b onClick={()=>{if(Object.entries(submittedData).length != 0){navigateToPage('intermediate')}}}><u>Noise Tuning</u></b></> :
                        <>This </>
                        }  section helps visualize what the noise tuning would look like. It includes dropdowns and sliders 
                            to select the <b>noise distribution type</b> and adjust the <b>amount</b> of noise picked. In a real world scenario, the <b>distribution type</b> and <b>ε</b> value used will already be configured, where the client would not need to manually adjust these.

                        </p>
                    </li>
                    <li>
                    {showHeader &&
                        <h3><b onClick={()=>{if(Object.entries(finalOutput).length != 0){navigateToPage('finalResults')}}}><u>Final Result</u></b></h3>
                    }
                    <p>{!showHeader ?
                        <>The <b onClick={()=>{if(Object.entries(finalOutput).length != 0){navigateToPage('finalResults')}}}><u>Final Result</u></b></> :
                        <>This</>
                        } section shows a JSON representation of the differentially privatized
                            results. These results can be approved by a user before submission if the system is designed to do.
                            This JSON represented data is what reaches the server and gets stored in the database.
                            The privatized data can then be queried and used for further analyses.
                        </p>
                    </li>
                </ul>
            </Col>
            </Row>
        </Container> 
    )
}

export default Guide
import React,{useEffect,useContext} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { pageNumbers,classNames } from '../initialStates';

function Guide() {

    const navigateToPage = (pageName) => {
        if(document.getElementsByClassName(classNames.getHeight).length > 0){
            const height = Number(document.getElementsByClassName(classNames.getHeight)[0].clientHeight); 
            const num = pageNumbers[pageName];
            window.scrollTo({top:height*(num-1),behavior: "smooth"});
        }
    }
    const showHeader = innerHeight < 720 ? false : true;
    return (
        <Container fluid className="custom-container guide" style={{color:'#00203FFF'}}>
            <Row>
            <Col style={{paddingTop: '10px', border: 'solid #00203f',borderRadius: '10px'}}>
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
                        the values are masked before they even leave the client's device, thus adding anonymity to the data <b>AT source</b>.
                    </p>
                    </li>
                    <li>
                    {showHeader &&
                        <h3><b onClick={()=>navigateToPage('intermediate')}><u>Noise Tuning</u></b></h3>
                    }
                    <p>{!showHeader ?
                        <>The <b onClick={()=>navigateToPage('intermediate')}><u>Noise Tuning</u></b></> :
                        <>This </>
                        }  section helps visualize what the noise tuning would look like. It includes dropdowns and sliders 
                            to select the <b>kind</b> and adjust the <b>amount</b> of noise. In a real world scenario, the type and amount
                            of noise would have already been pre configured, and the user would not have control over the amount of privacy being guaranteed.

                        </p>
                    </li>
                    <li>
                    {showHeader &&
                        <h3><b onClick={()=>navigateToPage('finalResults')}><u>Final Result</u></b></h3>
                    }
                    <p>{!showHeader ?
                        <>The <b onClick={()=>navigateToPage('finalResults')}><u>Final Result</u></b></> :
                        <>This</>
                        } section shows a JSON representation of the differentially privatized
                            results. This JSON represented data is what reaches the server and gets stored in the database. The 
                            privatized data can then be queried and used for further analyses.
                        </p>
                    </li>
                </ul>
            </Col>
            </Row>
        </Container> 
    )
}

export default Guide
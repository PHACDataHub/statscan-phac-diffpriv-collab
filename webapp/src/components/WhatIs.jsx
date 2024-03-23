import React,{useEffect,useContext,useRef} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import image from "../img/LocalDP_OpenMined2.png";
import { pageNumbers,classNames } from '../initialStates';

function WhatIs() {

    const colRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(()=>{
        const colWidth = colRef.current.clientWidth;
        const colHeight = colRef.current.clientHeight;
        const imgWidth = imgRef.current.clientWidth;
        const imgHeight = imgRef.current.clientHeight;
        const centerWidth = (colWidth - imgWidth)/2;
        const centerHeight = (colHeight - imgHeight)/2;
        console.log(colWidth,colHeight,imgWidth,imgHeight);
        imgRef.current.style.transform = `translate(${centerWidth}px,${centerHeight}px)`;
    },[colRef.current,imgRef.current])

    return (
            <Container fluid className="custom-container whatIs" style={{color:'#00203FFF'}}>
                <Row>
                    <Col>
                        <h1><b>What Is Local DP?</b></h1>
                        <p>
                            <b>Differential privacy (DP)</b> is a mathematical framework for quantifying the amount of privacy allocated to outputs, or inputs in this scenario, to help protect the privacy of the individuals whose data we want to analyze. 
                            The amount of privacy being added is represented by a privacy budget <b>Epsilon - ε</b>.
                            DP aims to strike a balance between providing useful
                            information from a dataset and protecting the privacy of the individuals whose data it
                            contains.
                        </p>
                        <p>
                            <b>Local Differential privacy</b> is a DP approach wherein the privacy of a user's data
                            is enhanced by introducing some randomness, referred to as <b>noise</b>, to the data. The kind and amount
                            of noise is seleted based on the nature of the data. The salience of Local DP lies 
                            in the fact that the <b>noise is introduced at source</b> - the client/data generator, thereby providing clients with plausible deniability for any 
                            claims to the individual made by external entities -  data curator/data consumer. The image on the right
                            depicts exactly how Local DP works in practice 
                            (source <a href="https://blog.openmined.org/basics-local-differential-privacy-vs-global-differential-privacy/">OpenMined</a>) and
                            this demo simulates the <b>lower half of the image</b> that focuses on noise injection before the data leaves the client's device.
                        </p>
                    </Col>
                    <Col ref={colRef}>
                        <img ref={imgRef} src={image} style={{border:'solid', borderRadius:'10px', height:'600px',width:'400px'}} alt="Local DP Illustration" />
                    </Col>
                </Row>
            </Container> 
    )
}

export default WhatIs
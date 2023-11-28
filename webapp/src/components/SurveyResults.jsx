import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';

const SurveyResults = ({ data }) => {
  return (
    <Container>
      <h2>Survey Results</h2>
      {data.map((question, index) => (
        <div key={index} className="mb-4">
          <h4>{question.question}</h4>
          <Row>
            {question.options.map((option, optionIndex) => (
              <Col key={optionIndex} xs={12} md={6}>
                <p>{option.text}</p>
                <ProgressBar
                  variant="info"
                  now={(option.votes / question.totalVotes) * 100}
                  label={`${option.votes} Votes`}
                />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default SurveyResults;

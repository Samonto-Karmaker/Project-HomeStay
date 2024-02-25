import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ImgSwiper from './ImgSwiper';
import PlaceInfo from './PlaceInfo';
import PlaceReserve from './PlaceReserve';

function PlaceDetails() {
  return (
    <Container>
      <Row>
        <Col>
          <ImgSwiper />
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <PlaceInfo />
        </Col>
        <Col md={4}>
          <PlaceReserve />
        </Col>
      </Row>
    </Container>
  );
}

export default PlaceDetails;
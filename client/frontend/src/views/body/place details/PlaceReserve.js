import React, { useState } from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";

const PlaceReserve = ({ price, isAvailable }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const isValidDateRange = () => {
    const today = new Date().setHours(0, 0, 0, 0);

    if (!checkIn || !checkOut) return false;
    if (checkIn < today) {
      alert("Time Travel is not allowed!");
      return false;
    }

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      alert("Check Out must be after Check In!");
      return false;
    }
    return true;
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return price;
    if (!isValidDateRange()) return price;

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * price;
  };

  return (
    <Card
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
        marginTop: "25px",
        marginBottom: "25px",
      }}
    >
      <Card.Header>
        <span style={{ fontWeight: "bold", fontSize: "30px" }}>
          ${calculateTotalPrice()}
        </span>
        <span>/night</span>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {isAvailable ? "Book Now!" : "Sorry, Not Available"}
        </Card.Text>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="3">
              Check In
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="date"
                onChange={(e) => setCheckIn(new Date(e.target.value))}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">
              Check Out
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="date"
                onChange={(e) => setCheckOut(new Date(e.target.value))}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">
              Guests
            </Form.Label>
            <Col sm="9">
              <Form.Control type="number" min="1" value="1" />
            </Col>
          </Form.Group>
          {isAvailable && (
            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <RegularBtn type="submit">Reserve</RegularBtn>
              </Col>
            </Form.Group>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PlaceReserve;

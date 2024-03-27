import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";

const AvailabilityDateChange = ({
  showModal,
  onHide,
  placeId,
  currentAvailability,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(currentAvailability);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Availability:", availability);
    onHide();
  };

  return (
    <>
      <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>
            Availability Date Change
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formToggle">
              <Form.Check
                type="switch"
                label="Availability"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <br />
            <RegularBtn type="submit">Submit</RegularBtn>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AvailabilityDateChange;

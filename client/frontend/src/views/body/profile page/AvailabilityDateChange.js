import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";
import isValidDateRange from "../../../utilities/isValidDateRange";

const AvailabilityDateChange = ({
  showModal,
  onHide,
  placeId,
  currentAvailability,
  isNotAvailableFrom,
  isNotAvailableTo,
  fetchOwnerPlaces,
}) => {
  const [startDate, setStartDate] = useState(isNotAvailableFrom || "");
  const [endDate, setEndDate] = useState(isNotAvailableTo || "");
  const [availability, setAvailability] = useState(currentAvailability);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to update availability?")) {
      if(!isValidDateRange(startDate, endDate)) return;

      try {
        const response = await fetch(
          `/api/places/update-availability/${placeId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isAvailable: availability,
              isNotAvailableFrom: startDate,
              isNotAvailableTo: endDate,
            }),
          }
        );

        const result = await response.json();
        console.log(result.message);
        if (result.success) {
          window.alert("Availability updated successfully");
          fetchOwnerPlaces();
        } else {
          window.alert(result.message);
        }
      } catch (err) {
        console.log(err);
        window.alert("Something went wrong");
      }
    }

    setAvailability(currentAvailability);
    setStartDate(isNotAvailableFrom || "");
    setEndDate(isNotAvailableTo || "");

    onHide();
  };

  return (
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
              value={startDate === "" ? "" : startDate.split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={availability}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate === "" ? "" : endDate.split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={availability}
            />
          </Form.Group>
          <br />
          <RegularBtn type="submit">Submit</RegularBtn>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AvailabilityDateChange;

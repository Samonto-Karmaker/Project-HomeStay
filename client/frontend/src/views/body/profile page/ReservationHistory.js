import React from "react";
import { Modal, Table } from "react-bootstrap";

const ReservationHistory = ({
    showModal,
    onHide,
    placeId,
    fetchOwnerPlaces,
}) => {
    return (
        <Modal show={showModal} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Reservation History</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight: "500px"}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Guest Name</th>
                            <th>Guest Email</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Total Amount</th>
                            <th>Confirmation Status</th>
                            <th>Payment Status</th>
                            <th>Visit Status</th>
                        </tr>
                    </thead>
                </Table>
            </Modal.Body>
        </Modal>
    );
}

export default ReservationHistory;
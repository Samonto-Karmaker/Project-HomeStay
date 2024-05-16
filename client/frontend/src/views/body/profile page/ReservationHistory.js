import React, { useState, useEffect, useCallback } from "react";
import { Modal, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import calculateTotalPrice from "../../../utilities/calculateTotalPrice";

const ReservationHistory = ({ showModal, onHide, placeId }) => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReservationHistory = useCallback(async () => {
        try {
            const response = await fetch(`/api/bookings/${placeId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (result.success) {
                if (result.bookings.length > 0) {
                    setReservations(result.bookings);
                } else {
                    setReservations([]);
                }
            } else {
                window.alert(result.message);
            }
        } catch (error) {
            console.log(error);
            window.alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [placeId]);

    const handleApproval = async (name, bookingId) => {
        if (
            window.confirm("Are you sure you want to approve this reservation?")
        ) {
            try {
                const response = await fetch(
                    `/api/bookings/${bookingId}/approve`,
                    {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: name }),
                    }
                );
                const result = await response.json();
                if (result.success) {
                    fetchReservationHistory();
                    window.alert(`Reservation ${name} successfully`);
                } else {
                    window.alert(result.message);
                }
            } catch (error) {
                console.log(error);
                window.alert("Something went wrong");
            }
        }
    };

    useEffect(() => {
        fetchReservationHistory();
    }, [fetchReservationHistory]);

    return (
        <Modal
            show={showModal}
            onHide={onHide}
            size={reservations.length > 0 ? "xl" : "md"}
        >
            <Modal.Header closeButton>
                <Modal.Title>Reservation History</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : reservations.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Guest Name</th>
                                <th>Guest Email</th>
                                <th>Total Guests</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Total Amount</th>
                                <th>Confirmation Status</th>
                                <th>Payment Status</th>
                                <th>Visit Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td>{reservation.guestName}</td>
                                    <td>{reservation.guestEmail}</td>
                                    <td>{reservation.guests}</td>
                                    <td>
                                        {new Date(
                                            reservation.checkIn
                                        ).toDateString()}
                                    </td>
                                    <td>
                                        {new Date(
                                            reservation.checkOut
                                        ).toDateString()}
                                    </td>
                                    <td>
                                        $
                                        {calculateTotalPrice(
                                            reservation.checkIn,
                                            reservation.checkOut,
                                            reservation.price,
                                            true
                                        )}
                                    </td>
                                    <td>
                                        {reservation.isConfirmed ? (
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                style={{ color: "green" }}
                                                aria-label="Confirmed"
                                            />
                                        ) : (
                                            <Form.Check
                                                type="switch"
                                                name="isConfirmed"
                                                checked={
                                                    reservation.isConfirmed
                                                }
                                                onChange={(e) =>
                                                    handleApproval(
                                                        e.target.name,
                                                        reservation._id
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {reservation.isPaid ? (
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                style={{ color: "green" }}
                                                aria-label="Paid"
                                            />
                                        ) : (
                                            <Form.Check
                                                type="switch"
                                                name="isPaid"
                                                disabled={
                                                    !reservation.isConfirmed
                                                }
                                                checked={reservation.isPaid}
                                                onChange={(e) =>
                                                    handleApproval(
                                                        e.target.name,
                                                        reservation._id
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {reservation.isVisited ? (
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                style={{ color: "green" }}
                                                aria-label="Visited"
                                            />
                                        ) : (
                                            <Form.Check
                                                type="switch"
                                                name="isVisited"
                                                disabled={
                                                    !reservation.isConfirmed ||
                                                    new Date(
                                                        reservation.checkOut
                                                    ).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ||
                                                    new Date(
                                                        reservation.checkIn
                                                    ).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
                                                }
                                                checked={reservation.isVisited}
                                                onChange={(e) =>
                                                    handleApproval(
                                                        e.target.name,
                                                        reservation._id
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="no-reservations-container">
                        <img
                            src="/not-found.png"
                            alt="No reservations found"
                            className="myImage"
                        />
                        <p>No reservations found</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ReservationHistory;

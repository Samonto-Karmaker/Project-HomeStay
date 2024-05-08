import React, { useState, useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import calculateTotalPrice from "../../../utilities/calculateTotalPrice";

const ReservationHistory = ({ showModal, onHide, placeId }) => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReservationHistory = async () => {
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
    };

    useEffect(() => {
        fetchReservationHistory();
    });

    return (
        <Modal show={showModal} onHide={onHide} size={reservations.length > 0 ? "xl" : "md"}>
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
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                style={{ color: "red" }}
                                                aria-label="Not Confirmed"
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
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                style={{ color: "red" }}
                                                aria-label="Not Paid"
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
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                style={{ color: "red" }}
                                                aria-label="Not Visited"
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

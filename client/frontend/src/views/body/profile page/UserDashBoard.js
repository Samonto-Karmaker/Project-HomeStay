import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import calculateTotalPrice from "../../../utilities/calculateTotalPrice";

const UserDashBoard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const response = await fetch("/api/bookings", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (result.success) {
                setBookings(result.bookings);
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

    const handleRatingSubmit = async (e) => {
        if (e.target.value === "0") return;
        if (window.confirm("Are you sure you want to submit this rating?")) {
            console.log(e.target.value);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (isLoading) return <h1>Loading...</h1>;

    return (
        <div>
            <h3 style={{ textAlign: "left", margin: "25px" }}>
                User DashBoard
            </h3>
            <br />
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Given Rating</th>
                        <th>Total Cost</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Confirmation Status</th>
                        <th>Payment Status</th>
                        <th>Visit Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>
                                <Link
                                    to={`/place/${booking.placeId}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "red",
                                    }}
                                >
                                    {booking.placeName}
                                </Link>
                            </td>
                            <td>{booking.placeLocation}</td>
                            <td>
                                {booking.rating === 0 ? (
                                    <Form.Select
                                        onChange={(e) => handleRatingSubmit(e)}
                                    >
                                        <option value="0">
                                            Please Rate Your Experience
                                        </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Form.Select>
                                ) : (
                                    booking.rating
                                )}
                            </td>
                            <td>
                                {calculateTotalPrice(
                                    booking.checkIn,
                                    booking.checkOut,
                                    booking.placePrice,
                                    true
                                )}
                            </td>
                            <td>
                                {
                                    new Date(booking.checkIn)
                                        .toLocaleDateString()
                                        .split("T")[0]
                                }
                            </td>
                            <td>
                                {
                                    new Date(booking.checkOut)
                                        .toLocaleDateString()
                                        .split("T")[0]
                                }
                            </td>
                            <td>
                                {booking.isConfirmed ? (
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
                                {booking.isPaid ? (
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
                                {booking.isVisited ? (
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
        </div>
    );
};

export default UserDashBoard;

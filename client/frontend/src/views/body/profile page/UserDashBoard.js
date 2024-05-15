import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import StarRatings from "react-star-ratings";
import calculateTotalPrice from "../../../utilities/calculateTotalPrice";
import RegularBtn from "../../../components/reusable/RegularBtn";

const UserDashBoard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState({
        bookingId: "",
        rating: 0,
    });

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
                if (result.bookings.length > 0) {
                    setBookings(result.bookings);
                } else {
                    setBookings([]);
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

    const handleRatingSubmit = async ({ bookingId, rating }) => {
        if (rating === "0") return;
        if (
            window.confirm(
                `Are you sure you want rate your experience to ${rating}?`
            )
        ) {
            try {
                const response = await fetch(
                    `/api/bookings/${bookingId}/rating`,
                    {
                        method: "PUT",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ rating }),
                    }
                );
                const result = await response.json();
                if (result.success) {
                    fetchBookings();
                    setSelectedBooking({ bookingId: "", rating: 0 });
                } else {
                    window.alert(result.message);
                }
            } catch (error) {
                console.log(error);
                window.alert("Something went wrong");
            }
        }
    };
    
    const handleBookingCancel = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await fetch(`/api/bookings/${bookingId}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.success) {
                    fetchBookings();
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
        fetchBookings();
    }, []);

    useEffect(() => {
        if (selectedBooking.bookingId && selectedBooking.rating !== 0) {
            handleRatingSubmit(selectedBooking);
        }
    }, [selectedBooking]);

    if (isLoading) return <h1>Loading...</h1>;

    if (bookings.length === 0) return;

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
                        <th>Cancel Booking</th>
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
                                        disabled={!booking.isVisited}
                                        onChange={(e) =>
                                            setSelectedBooking({
                                                bookingId: booking._id,
                                                rating: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="0">
                                            Rate Your Experience
                                        </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Form.Select>
                                ) : (
                                    <StarRatings
                                        rating={booking.rating}
                                        starRatedColor="red"
                                        numberOfStars={5}
                                        name="rating"
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                )}
                            </td>
                            <td>
                                $
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
                            <td>
                                <RegularBtn
                                    disabled={booking.isVisited}
                                    onClick={() => handleBookingCancel(booking._id)}
                                >
                                    <FontAwesomeIcon 
                                        icon={faTrash}
                                    />
                                </RegularBtn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserDashBoard;

import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

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
                        <th>Is Confirmed</th>
                        <th>Is Paid</th>
                        <th>Is Visited</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((bookings) => (
                        <tr key={bookings._id}>
                            <td>{bookings.placeName}</td>
                            <td>{bookings.placeLocation}</td>
                            <td>{bookings.rating}</td>
                            <td>Dummy</td>
                            <td>
                                {
                                    new Date(bookings.checkIn)
                                        .toLocaleDateString()
                                        .split("T")[0]
                                }
                            </td>
                            <td>
                                {
                                    new Date(bookings.checkOut)
                                        .toLocaleDateString()
                                        .split("T")[0]
                                }
                            </td>
                            <td>{bookings.isConfirmed ? "True" : "False"}</td>
                            <td>{bookings.isPaid ? "True" : "False"}</td>
                            <td>{bookings.isVisited ? "True" : "False"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserDashBoard;

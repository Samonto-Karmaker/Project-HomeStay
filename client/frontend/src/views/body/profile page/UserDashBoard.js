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
                console.log(result.bookings);
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
            </Table>
        </div>
    );
};

export default UserDashBoard;

import React, { useState, useContext } from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";
import calculateTotalPrice from "../../../utilities/calculateTotalPrice";
import { UserContext } from "../../../components/context/UserContext";

const PlaceReserve = ({ placeId, price, isAvailable }) => {
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);

    const { User } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!User) {
            alert("Please login to reserve this place");
            return;
        }
        if (!checkIn || !checkOut) {
            alert("Please select check in and check out dates");
            return;
        }
        const reservation = {
            placeId,
            checkIn,
            checkOut,
            guests,
        };

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reservation),
            })
            const result = await response.json();
            if (result.success) {
                window.alert("Reservation successful");
                setCheckIn(null);
                setCheckOut(null);
                setGuests(1);
            } else {
                console.log(checkIn, checkOut, guests);
                window.alert(result.message);
            }
        }
        catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
        
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
                    ${calculateTotalPrice(checkIn, checkOut, price, false)}
                </span>
                <span>/night</span>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {isAvailable ? "Book Now!" : "Sorry, Not Available"}
                </Card.Text>
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3">
                            Check In
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="date"
                                onChange={(e) =>
                                    setCheckIn(e.target.value)
                                }
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
                                onChange={(e) =>
                                    setCheckOut(e.target.value)
                                }
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3">
                            Guests
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    {isAvailable && User && (
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

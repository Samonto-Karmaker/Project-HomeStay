import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3 style={{ paddingTop: "5px", paddingBottom: "5px" }}>Welcome to Airbnb Clone</h3>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="mobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Button 
                className="RegularBtn" 
                type="submit"
                style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    backgroundColor: "red", 
                    color: "white",
                    borderColor: "white",
                }}
            >
                Register
            </Button>
        </Form>
    );
};

export default RegisterForm;

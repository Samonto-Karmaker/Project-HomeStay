import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const RegisterForm = props => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const removeErrors = () => {
        setNameError("");
        setEmailError("");
        setMobileError("");
        setPasswordError("");
        setConfirmPasswordError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        removeErrors();
        
        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        }
        else {
            try{
                const { name, email, mobile, password } = formData;
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, mobile, password }),
                });
                const result = await response.json();
                if(result.success){
                    removeErrors();
                    window.alert("Registered successfully! Please login to continue");
                    setTimeout(() => {
                        props.closeModal();
                    }, 1000)
                }
                else if(result.status === 400){
                    window.alert("User already exists");
                }
                else{
                    Object.keys(result.errors).forEach((field) => {
                        if (field === "name") {
                            setNameError(result.errors[field].msg);
                        }
                        if (field === "email") {
                            setEmailError(result.errors[field].msg);
                        }
                        if (field === "mobile") {
                            setMobileError(result.errors[field].msg);
                        }
                        if (field === "password") {
                            setPasswordError(result.errors[field].msg);
                        }
                    });
                }
            }
            catch(err){
                console.log(err);
                window.alert("Something went wrong");
            }
        }

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
                {nameError && (<p style={{ color: "red" }}>{nameError}</p>)}
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
                {emailError && (<p style={{ color: "red" }}>{emailError}</p>)}
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
                {mobileError && (<p style={{ color: "red" }}>{mobileError}</p>)}
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
                {passwordError && (<p style={{ color: "red" }}>{passwordError}</p>)}
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
                {confirmPasswordError && (<p style={{ color: "red" }}>{confirmPasswordError}</p>)}
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

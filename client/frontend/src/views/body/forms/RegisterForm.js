import React, { useState } from "react";
import { Form } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";

const RegisterForm = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        avatar: "",
    });

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "avatar") {
            setFormData({
                ...formData,
                avatar: e.target.files[0],
            });
            return;
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarDelete = () => {
        setFormData({
            ...formData,
            avatar: "",
        });
    };

    const removeErrors = () => {
        setNameError("");
        setEmailError("");
        setMobileError("");
        setPasswordError("");
        setConfirmPasswordError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        removeErrors();

        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            try {
                const { name, email, mobile, password, avatar } = formData;
                const data = new FormData();

                data.append("name", name);
                data.append("email", email);
                data.append("mobile", mobile);
                data.append("password", password);
                if (avatar) data.append("avatar", avatar);

                const response = await fetch("/api/register", {
                    method: "POST",
                    body: data,
                });
                const result = await response.json();
                if (result.success) {
                    removeErrors();
                    window.alert(
                        "Registered successfully! Please login to continue"
                    );
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                } else if (result.status === 400) {
                    window.alert("User already exists");
                } else {
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
                        } else {
                            window.alert(result.message);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                window.alert("Something went wrong");
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3 style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                Welcome to Project HomeStay
            </h3>
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                />
                {nameError && <p style={{ color: "red" }}>{nameError}</p>}
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="abc@xyz.com"
                    onChange={handleChange}
                    required
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            </Form.Group>

            <Form.Group controlId="mobile">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    placeholder="0123456789"
                    onChange={handleChange}
                    required
                />
                {mobileError && <p style={{ color: "red" }}>{mobileError}</p>}
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="********"
                    onChange={handleChange}
                    required
                />
                {passwordError && (
                    <p style={{ color: "red" }}>{passwordError}</p>
                )}
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="********"
                    onChange={handleChange}
                    required
                />
                {confirmPasswordError && (
                    <p style={{ color: "red" }}>{confirmPasswordError}</p>
                )}
            </Form.Group>

            <Form.Group controlId="avatar">
                <Form.Label>Upload an Avatar</Form.Label>
                <Form.Control
                    type="file"
                    name="avatar"
                    onChange={handleChange}
                />
            </Form.Group>
            {formData.avatar && (
                <div style={{display: "block"}}>
                    <div
                        style={{
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        {console.log(formData.avatar.file)}
                        <img
                            src={URL.createObjectURL(formData.avatar)}
                            alt="Avatar Preview"
                            style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                margin: "10px",
                            }}
                        />
                        <RegularBtn
                            onClick={handleAvatarDelete}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                borderRadius: "50%",
                                border: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            X
                        </RegularBtn>
                    </div>
                </div>
            )}

            <RegularBtn type="submit">Register</RegularBtn>
        </Form>
    );
};

export default RegisterForm;

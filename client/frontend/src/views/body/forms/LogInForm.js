import React, {useState, useContext} from "react";
import {UserContext} from "../../../components/context/UserContext";
import { SocketContext } from "../../../components/context/SocketContext";
import {Form} from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";

const LogInForm = ({closeModal, toggle}) => {

    const {setUser} = useContext(UserContext);
    const socket = useContext(SocketContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const openRegister = () => {
        closeModal();
        toggle();
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const removeErrors = () => {
        setEmailError("");
        setPasswordError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        removeErrors();

        try{
            const {email, password} = formData;
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const result = await response.json();
            if(result.success){
                setUser(result.loggedInUser);
                socket.emit("login", result.loggedInUser.userId);
                removeErrors();
                window.alert("Logged in successfully!");
                setTimeout(() => {
                    closeModal();
                }, 1000)
            }
            else{
                if(result.message === "Invalid Credentials"){
                    setEmailError(result.message);
                }
                else if(result.message === "Invalid Password"){
                    setPasswordError(result.message);
                }
                else{
                    window.alert("Something went wrong");
                }
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <h3 style={{ paddingTop: "5px", paddingBottom: "5px" }}>Welcome to Project HomeStay</h3>
            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="abc@xyz.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Form.Text className="text-danger">{emailError}</Form.Text>
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Form.Text className="text-danger">{passwordError}</Form.Text>
            </Form.Group>

            <RegularBtn type="submit">Log In</RegularBtn>
            <p 
                style={{ 
                    paddingTop: "5px", 
                    paddingBottom: "5px", 
                    color: "gray" 
                    }}
            >
                Don't have an account?
            </p>
            <p style={{ color: "red", cursor: "pointer"}} onClick={openRegister}>Register</p>
        </Form>
    );
}

export default LogInForm;
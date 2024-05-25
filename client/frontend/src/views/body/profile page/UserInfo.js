import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";
import UserAvatar from "../../../components/reusable/UserAvatar";
import { SocketContext } from "../../../components/context/SocketContext";

const UserInfo = ({ isUser, user, setUser }) => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const fileInputRef = useRef();

    const handleLogOut = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try {
                const response = await fetch("/api/logout", {
                    method: "DELETE",
                    credentials: "include",
                });
                const result = await response.json();
                if (result.success) {
                    socket.emit("logout", user.userId);
                    setUser(null);
                    navigate("/");
                }
                window.alert(result.message);
            } catch (err) {
                console.log(err);
                window.alert("Something went wrong");
            }
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const updateAvatar = async (e) => {
        const formData = new FormData();
        formData.append("avatar", e.target.files[0]);
        try {
            const response = await fetch("/api/update-avatar", {
                method: "PUT",
                credentials: "include",
                body: formData,
            })
            
            const result = await response.json();
            if (result.success) {
                setUser({ ...user, avatar: result.avatar });
            } else {
                window.alert(result.message);
            }
        } catch (err) {
            console.log(err);
            window.alert("Something went wrong");
        }
    };

    return (
        <Card
            bg="light"
            text="dark"
            style={{
                width: "25rem",
                margin: "35px auto",
                padding: "15px",
                borderRadius: "20px",
                border: "2px solid #f8f9fa",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            }}
            className="mb-2"
        >
            <Card.Header
                style={{
                    fontSize: "30px",
                    color: "red",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    borderBottom: "2px solid #f8f9fa",
                }}
            >
                Profile
            </Card.Header>
            <Card.Body>
                <UserAvatar avatar={true && user.avatar} />
                <Card.Title
                    style={{
                        fontSize: "25px",
                        fontFamily: "Fantasy",
                        paddingBottom: "10px",
                        backgroundColor: "white !important",
                    }}
                >
                    {user.name}
                </Card.Title>
                <Card.Text>Email: {user.email}</Card.Text>
                <Card.Text>Mobile: {user.mobile}</Card.Text>
                <Card.Text>Is Owner: {user.isOwner ? "Yes" : "No"}</Card.Text>
            </Card.Body>
            {isUser && (
                <Card.Footer
                    style={{
                        borderBottomLeftRadius: "20px",
                        borderBottomRightRadius: "20px",
                        borderTop: "2px solid #f8f9fa",
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                    }}
                >
                    <RegularBtn onClick={handleLogOut}>Log Out</RegularBtn>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={e => updateAvatar(e)}
                        style={{ display: "none" }}
                    />
                    <RegularBtn onClick={handleAvatarClick}>
                        {user.avatar ? "Update Avatar" : "Upload Avatar"}
                    </RegularBtn>
                </Card.Footer>
            )}
        </Card>
    );
};

export default UserInfo;

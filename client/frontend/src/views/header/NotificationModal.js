import React, { useState, useEffect, useContext } from "react";
import { Modal, ListGroup } from "react-bootstrap";
import { UserContext } from "../../components/context/UserContext";

const NotificationModal = ({ showModal, onHide }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { User } = useContext(UserContext);

    const fetchNotification = async () => {
        try {
            const response = await fetch(`/api/notifications`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (result.success) {
                if (result.notifications.length > 0) {
                    setNotifications(result.notifications);
                } else {
                    setNotifications([]);
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

    useEffect(() => {
        if (User) {
            fetchNotification();
        }
    }, [User]);

    return (
        <Modal
            show={showModal}
            onHide={onHide}
            size={notifications.length > 0 ? "lg" : "md"}
        >
            <Modal.Header closeButton>
                <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight: "500px", overflowY: "auto"}}>
                {isLoading ? (
                    <h1>Loading...</h1>
                ) : notifications.length > 0 ? (
                    <ListGroup>
                        {notifications.map((notification, index) => (
                            <ListGroup.Item
                                key={index}
                                style={{
                                    margin: "5px",
                                    border: "1px solid",
                                    borderColor: "#f8f9fa",
                                    borderRadius: "20px",
                                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                <h5 style={{ color: "red" }}>
                                    {notification.title}
                                </h5>
                                <p>{notification.message}</p>
                                <small style={{ color: "gray" }}>
                                    {new Date(
                                        notification.createdAt
                                    ).toDateString()}
                                </small>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <div className="no-reservations-container">
                        <img
                            src="/not-found.png"
                            alt="No notification found"
                            className="myImage"
                        />
                        <p>No notification found</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default NotificationModal;

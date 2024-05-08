import React from "react";
import { Modal } from "react-bootstrap";

const NotificationModal = ({ showModal, onHide }) => {
    return (
        <Modal show={showModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h1>Notification</h1>
            </Modal.Body>
        </Modal>
    );
};

export default NotificationModal;

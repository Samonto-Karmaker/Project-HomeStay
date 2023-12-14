import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import RegisterForm from '../../views/body/forms/RegisterForm';
import LogInForm from '../../views/body/forms/LogInForm';

const BaseModal = ({modal, toggle, show, onHide}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title 
                    id="contained-modal-title-vcenter"
                    style={{ color: "red" }}
                >
                    {modal === "Register" ? "Register" : "Log In"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modal === "Register" ? 
                    <RegisterForm closeModal = {onHide} /> : 
                    <LogInForm closeModal = {onHide} toggle = {toggle}/>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    className='RegularBtn'
                    onClick={onHide}
                    style={{
                        backgroundColor: "red", 
                        color: "white",
                        borderColor: "white",
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BaseModal;
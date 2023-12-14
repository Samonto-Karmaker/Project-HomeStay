import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import RegisterForm from '../../views/body/forms/RegisterForm';
import LogInForm from '../../views/body/forms/LogInForm';

const BaseModal = props => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title 
                    id="contained-modal-title-vcenter"
                    style={{ color: "red" }}
                >
                    {props.modal === "Register" ? "Register" : "Log In"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.modal === "Register" ? 
                    <RegisterForm closeModal = {props.onHide} /> : 
                    <LogInForm closeModal = {props.onHide} toggle = {props.toggle}/>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    className='RegularBtn'
                    onClick={props.onHide}
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
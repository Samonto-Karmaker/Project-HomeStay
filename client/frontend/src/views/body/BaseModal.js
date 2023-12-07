import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import RegisterForm from './forms/RegisterForm';
import LogInForm from './forms/LogInForm';

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
                    <b>Log In</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LogInForm closeModal={props.onHide} />
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
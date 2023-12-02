import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import RegisterForm from '../body/forms/RegisterForm';

const Register = props => {
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
                    <b>Register</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RegisterForm closeModal = {props.onHide}/>
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

export default Register;
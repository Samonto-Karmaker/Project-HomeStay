import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import BaseModal from "../../components/reusable/BaseModal";
import { UserContext } from "../../components/context/UserContext";
import NavUserBtn from "../../components/reusable/NavUserBtn";

const NavBar = () => {
  const { User } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleModal = type => {
    setModalType(type);
    setShowModal(true);
  }

  const handleLogIn = () => {
    if (User) {
      return (
        <>
          <NavUserBtn>
            <FontAwesomeIcon icon={faUser} />
          </NavUserBtn>
        </>
      );
    }
    return (
      <>
        <NavUserBtn 
          style={{width: "100px", borderRadius: "20px"}}
          onClick={() => handleModal("Log In")}
        > 
          Login 
        </NavUserBtn>
      </>
    );
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container style={{ padding: "10px" }}>
        <Navbar.Brand href="#home" style={{ color: "red", fontSize: "20px" }}>
          <FontAwesomeIcon
            icon={faAirbnb}
            size="lg"
            color="red"
            style={{ marginRight: "10px" }}
          />
          <b>AirBnB Clone</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" style={{ padding: "10px" }}>
          <Container
            fluid
            style={{
              border: "1px solid",
              borderColor: "#f8f9fa",
              borderRadius: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row
              className="align-items-center"
              style={{ padding: "5px", color: "grey" }}
            >
              <Col>
                <Nav.Link className="NavBtn" href="#home">
                  Home
                </Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link className="NavBtn" href="#booking">
                  Book Place
                </Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link className="NavBtn" href="#add-hideout">
                  Add Place
                </Nav.Link>
              </Col>
            </Row>
          </Container>
          <Nav>
            {handleLogIn()}
            <BaseModal
              modal = {modalType}
              toggle = {() => handleModal("Register")}
              show={showModal}
              onHide={() => setShowModal(false)}
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

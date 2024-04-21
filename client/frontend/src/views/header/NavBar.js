import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faHouse,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import BaseModal from "../../components/reusable/BaseModal";
import { UserContext } from "../../components/context/UserContext";
import NavUserBtn from "../../components/reusable/NavUserBtn";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { User } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleLogIn = () => {
    if (User) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/user/${User.userId}`} style={{ textDecoration: "none" }}>
            <NavUserBtn>
              <FontAwesomeIcon icon={faUser} />
            </NavUserBtn>
          </Link>

          <NavUserBtn>
            <FontAwesomeIcon icon={faBell} />
          </NavUserBtn>
        </div>
      );
    }
    return (
      <>
        <NavUserBtn
          style={{ width: "100px", borderRadius: "20px" }}
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
        <Navbar.Brand
          as={Link}
          to="/"
          style={{ color: "red", fontSize: "20px", fontFamily: "fantasy", fontWeight: "bold"}}
        >
          <i>Project HomeStay</i>
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
                <Nav.Link as={Link} to="/" className="NavBtn">
                  <FontAwesomeIcon icon={faHouse} />
                  <span style={{ padding: "10px" }}> Home </span>
                </Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link as={Link} to="/search-place" className="NavBtn">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                  <span style={{ padding: "10px" }}> Search </span>
                </Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link as={Link} to="/add-place" className="NavBtn" href="#add-hideout">
                  <FontAwesomeIcon icon={faPlus} />
                  <span style={{ padding: "10px" }}> Add Place </span>
                </Nav.Link>
              </Col>
            </Row>
          </Container>
          <Nav>
            {handleLogIn()}
            <BaseModal
              modal={modalType}
              toggle={() => handleModal("Register")}
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

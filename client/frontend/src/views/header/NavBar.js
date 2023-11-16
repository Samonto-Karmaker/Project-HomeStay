import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Button } from "react-bootstrap";

const NavBar = () => {
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
        <Navbar.Collapse id="responsive-navbar-nav" style={{padding: "10px"}}>
          <Container
            fluid
            style={{
              border: "1px solid",
              borderColor: "#f8f9fa",
              borderRadius: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row className="align-items-center" style={{ padding: "5px", color: "grey" }}>
              <Col>
                <Nav.Link href="#home">Home</Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link href="#booking">Book Your Next Hideout</Nav.Link>
              </Col>
              <Col xs="auto">
                <span>|</span>
              </Col>
              <Col>
                <Nav.Link href="#add-hideout">
                  Make Your Home A Hideout
                </Nav.Link>
              </Col>
            </Row>
          </Container>
          <Nav>
            <Button
              style={{
                marginLeft: "10px",
                backgroundColor: "#f8f9fa",
                borderColor: "#f8f9fa",
                borderStyle: "solid",
                borderWidth: "1px",
                color: "red",
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import PlaceCard from "./PlaceCard";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const location = useLocation();
  const searchedPlaces = location.state?.searchedPlaces;

  const fetchPlaces = async () => {
    try {
      const response = await fetch("/api/places", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        console.log(result.places);
        setPlaces(result.places);
      } else {
        window.alert(result.message);
      }
    } catch (err) {
      console.log(err);
      window.alert("Something went wrong");
    }
  };

  useEffect(() => {
    if(searchedPlaces) {
      setPlaces(searchedPlaces);
    } else {
      fetchPlaces();
    }
  }, [searchedPlaces]);

  return (
    <Container style={{marginBottom: "15px", marginTop: "15px"}}>
      <Row xs={1} md={2} lg={3} className="g-4">
        {places.map((place) => (
          <Col key={place._id}>
            <PlaceCard place={place} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Places;

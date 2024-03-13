import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import ImgSwiper from './ImgSwiper';
import PlaceInfo from './PlaceInfo';
import PlaceReserve from './PlaceReserve';

const PlaceDetails = () => {

    const [place, setPlace] = useState({})

    const location = useLocation();
    const placeId = location.pathname.split('/')[2];

    const fetchPlace = async placeId => {
        try {
            const response = await fetch(`/api/places/${placeId}`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if(result.success) {
                console.log(result.place);
                setPlace(result.place);
            } else {
                window.alert(result.message);
            }
        }
        catch(err) {
            console.log(err);
            window.alert('Something went wrong');
        }
    }

    useEffect(() => {
        fetchPlace(placeId);
    }, [placeId]);

    return (
        <Container>
            <Row>
                <Col>
                    <ImgSwiper images = {place.images}/>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    <PlaceInfo place = {place}/>
                </Col>
                <Col md={4}>
                    <PlaceReserve 
                        price = {place.price}
                        isAvailable = {place.isAvailable}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default PlaceDetails;
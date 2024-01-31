import React from "react";
import Card from 'react-bootstrap/Card';
import StarRating from 'react-star-ratings';

const PlaceCard = ({ place }) => {
  return (
    <div key={place._id}>
      <Card className="placeCard" 
        style={{ 
          width: '20rem', 
          margin: '15px', 
          textAlign: "left", 
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" 
        }}
      >
      <Card.Img variant="top" src={place.images[0]} />
      <Card.Body>
        <Card.Title>{place.name}</Card.Title>
        <StarRating 
          rating={place.rating}
          starRatedColor="gold"
          numberOfStars={5}
          name="rating"
          starDimension="20px"
          starSpacing="2px" 
        />
        <Card.Text style={{color: "gray"}}>
          {place.description}
        </Card.Text>
        <Card.Text>
          {place.city}, {place.country}
        </Card.Text>
        <Card.Text style={{color: "red"}}>
          price: ${place.price} / night
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};

export default PlaceCard;

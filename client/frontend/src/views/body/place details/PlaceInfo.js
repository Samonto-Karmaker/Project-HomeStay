import React from 'react';
import StarRatings from 'react-star-ratings';

const PlaceInfo = ({place}) => {
  return (
    <section style={{textAlign: "left", margin: "25px"}}>
      <h1 style={{fontFamily: "fantasy"}}>{place.name}</h1>
      <p>{place.city}, {place.country}</p>
      <p>{place.capacity} Bedrooms, ${place.price} Per Night</p>
      <b>Rating: </b>
      <StarRatings
        rating={place.rating}
        starRatedColor="red"
        numberOfStars={5}
        name='rating'
        starDimension="20px"
        starSpacing="2px"
      />
      <hr />
      <strong>Hosted by: </strong>
      <hr />
      <br />
      <h3 style={{fontFamily: "fantasy"}}>About This Place</h3>
      <p>{place.description}</p>
      <br />
      <h3 style={{fontFamily: "fantasy"}}>What This Place Offers</h3>
      <ul>
        {place.amenities.map((amenity, index) => {
          return <li style={{padding: "5px"}} key={index}>{amenity}</li>
        })}
      </ul>
      <br />
    </section>
  );
};

export default PlaceInfo;
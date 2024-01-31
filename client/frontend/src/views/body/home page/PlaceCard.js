import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <div className="place" key={place._id}>
      <div className="place-image">
        <img src={place.images[0]} alt={place.name} />
      </div>
      <div className="place-name">{place.name}</div>
      <div className="place-location">{place.location}</div>
      <div className="place-description">{place.description}</div>
      <div className="place-price">{place.price}</div>
    </div>
  );
};

export default PlaceCard;

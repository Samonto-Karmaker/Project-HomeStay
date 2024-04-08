import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";

const PlaceInfo = ({ place }) => {
  const [owner, setOwner] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchOwnerByID = async (ownerId) => {
    try {
      const response = await fetch(`/api/places/owner-info/${ownerId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.success) {
        setOwner(result.owner);
      } else {
        window.alert(result.message);
      }
    } catch (err) {
      console.log(err);
      window.alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (place.ownerId) {
      fetchOwnerByID(place.ownerId);
    }
  }, [place.ownerId]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <section style={{ textAlign: "left", margin: "25px" }}>
      <h1 style={{ fontFamily: "fantasy" }}>{place.name}</h1>
      <p>
        {place.city}, {place.country}
      </p>
      <p>
        {place.capacity} Bedrooms, ${place.price} Per Night
      </p>
      <b>Rating: </b>
      <StarRatings
        rating={place.rating}
        starRatedColor="red"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="2px"
      />
      <hr />
      <strong>
        Hosted by:{" "}
        {owner.name ? (
          <Link
            to={`/user/${owner._id}`}
            style={{ textDecoration: "none", color: "red" }}
            state={{ owner: owner, fromNavBar: false }}
          >
            {owner.name}
          </Link>
        ) : (
          "Unknown"
        )}{" "}
      </strong>
      <hr />
      <br />
      <h3 style={{ fontFamily: "fantasy" }}>About This Place</h3>
      <p>{place.description}</p>
      <br />
      <h3 style={{ fontFamily: "fantasy" }}>What This Place Offers</h3>
      <ul>
        {place.amenities.map((amenity, index) => {
          return (
            <li style={{ padding: "5px" }} key={index}>
              {amenity}
            </li>
          );
        })}
      </ul>
      <br />
    </section>
  );
};

export default PlaceInfo;

import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";
import AvailabilityDateChange from "./AvailabilityDateChange";

const OwnerDashBoard = ({ user }) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchOwnerPlaces = async () => {
    try {
      const response = await fetch(`/api/places/owner-places/${user.userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result.message);
      if (result.success) {
        setPlaces(result.places);
      }
    } catch (err) {
      console.log(err);
      window.alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerPlaces();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;
  if (places && places.length === 0) return <></>;

  return (
    <div>
      <h3 style={{ textAlign: "left", margin: "25px" }}>Owner DashBoard</h3>
      <br />
      <hr />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Price Per Night</th>
            <th>Availability</th>
            <th>Reservation History</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place) => (
            <tr key={place._id}>
              <td>{place.name}</td>
              <td>
                {place.city}, {place.country}
              </td>
              <td>${place.price}</td>
              <td>
                <RegularBtn onClick={() => setShowModal(true)}>
                  {place.isAvailable ? "Available" : "Not Available"}
                </RegularBtn>
              </td>
              <td>
                <RegularBtn>view</RegularBtn>
              </td>
              <AvailabilityDateChange
                showModal={showModal}
                onHide={() => setShowModal(false)}
                placeId={place._id}
                currentAvailability={place.isAvailable}
              />
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OwnerDashBoard;

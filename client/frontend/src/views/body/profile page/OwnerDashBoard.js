import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import RegularBtn from "../../../components/reusable/RegularBtn";
import AvailabilityDateChange from "./AvailabilityDateChange";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";

const OwnerDashBoard = ({ isUser, user }) => {
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const fetchOwnerPlaces = async () => {
        try {
            const response = await fetch(
                `/api/places/owner-places/${isUser ? user.userId : user._id}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

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
            <h3 style={{ textAlign: "left", margin: "25px" }}>
                Owner DashBoard
            </h3>
            <br />
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Rating</th>
                        <th>Price Per Night</th>
                        {isUser && (
                            <>
                                <th>Availability</th>
                                <th>Not Available From</th>
                                <th>Not Available To</th>
                                <th>Reservation History</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {places.map((place) => (
                        <tr key={place._id}>
                            <td>
                                <Link
                                    to={`/place/${place._id}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "red",
                                    }}
                                >
                                    {place.name}
                                </Link>
                            </td>
                            <td>
                                {place.city}, {place.country}
                            </td>
                            <td>
                                <StarRatings
                                    rating={place.rating}
                                    starRatedColor="red"
                                    numberOfStars={5}
                                    name="rating"
                                    starDimension="20px"
                                    starSpacing="2px"
                                />
                            </td>
                            <td>${place.price}</td>
                            {isUser && (
                                <>
                                    <td>
                                        <RegularBtn
                                            onClick={() => {
                                                setSelectedPlace(place);
                                                setShowModal(true);
                                            }}
                                        >
                                            {place.isAvailable
                                                ? "Available"
                                                : "Not Available"}
                                        </RegularBtn>
                                    </td>
                                    <td>
                                        {place.isNotAvailableFrom
                                            ? new Date(place.isNotAvailableFrom)
                                                  .toLocaleDateString()
                                                  .split("T")[0]
                                            : "N/A"}
                                    </td>
                                    <td>
                                        {place.isNotAvailableTo
                                            ? new Date(place.isNotAvailableTo)
                                                  .toLocaleDateString()
                                                  .split("T")[0]
                                            : "N/A"}
                                    </td>
                                    <td>
                                        <RegularBtn>view</RegularBtn>
                                    </td>
                                    {selectedPlace &&
                                        selectedPlace._id === place._id && (
                                            <AvailabilityDateChange
                                                showModal={showModal}
                                                onHide={() => {
                                                    setShowModal(false);
                                                    setSelectedPlace(null);
                                                }}
                                                placeId={selectedPlace._id}
                                                currentAvailability={
                                                    selectedPlace.isAvailable
                                                }
                                                isNotAvailableFrom={
                                                    selectedPlace.isNotAvailableFrom
                                                }
                                                isNotAvailableTo={
                                                    selectedPlace.isNotAvailableTo
                                                }
                                                fetchOwnerPlaces={
                                                    fetchOwnerPlaces
                                                }
                                            />
                                        )}
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default OwnerDashBoard;

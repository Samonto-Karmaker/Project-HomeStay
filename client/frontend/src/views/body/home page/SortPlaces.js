import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavUserBtn from "../../../components/reusable/NavUserBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpLong, faDownLong } from "@fortawesome/free-solid-svg-icons";

const SORTING = {
    RATING_UP: "Rating (High to Low)",
    RATING_DOWN: "Rating (Low to High)",
    PRICE_UP: "Price (High to Low)",
    PRICE_DOWN: "Price (Low to High)",
};

const SortPlaces = ({ setPlaces }) => {
    const [activeSort, setActiveSort] = useState(null);
    const location = useLocation();

    // Reset sorting when location changes
    useEffect(() => {
        setActiveSort(null)
    }, [location])

    const handleSorting = (sortType) => {
        setActiveSort(sortType);
        switch (sortType) {
            case SORTING.RATING_UP:
                setPlaces((prevPlaces) =>
                    [...prevPlaces].sort((a, b) => b.rating - a.rating)
                );
                break;
            case SORTING.RATING_DOWN:
                setPlaces((prevPlaces) =>
                    [...prevPlaces].sort((a, b) => a.rating - b.rating)
                );
                break;
            case SORTING.PRICE_UP:
                setPlaces((prevPlaces) =>
                    [...prevPlaces].sort((a, b) => b.price - a.price)
                );
                break;
            case SORTING.PRICE_DOWN:
                setPlaces((prevPlaces) =>
                    [...prevPlaces].sort((a, b) => a.price - b.price)
                );
                break;
            default:
                setPlaces((prevPlaces) => [...prevPlaces]);
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "15px",
                    marginTop: "15px",
                }}
            >
                <NavUserBtn
                    style={{ width: "auto", borderRadius: "20px" }}
                    onClick={() => handleSorting(SORTING.RATING_UP)}
                >
                    Rating <FontAwesomeIcon icon={faUpLong} />
                </NavUserBtn>
                <NavUserBtn
                    style={{ width: "auto", borderRadius: "20px" }}
                    onClick={() => handleSorting(SORTING.RATING_DOWN)}
                >
                    Rating <FontAwesomeIcon icon={faDownLong} />
                </NavUserBtn>
                <NavUserBtn
                    style={{ width: "auto", borderRadius: "20px" }}
                    onClick={() => handleSorting(SORTING.PRICE_UP)}
                >
                    Price <FontAwesomeIcon icon={faUpLong} />
                </NavUserBtn>
                <NavUserBtn
                    style={{ width: "auto", borderRadius: "20px" }}
                    onClick={() => handleSorting(SORTING.PRICE_DOWN)}
                >
                    Price <FontAwesomeIcon icon={faDownLong} />
                </NavUserBtn>
            </div>
            {activeSort && <p> Sorted: {activeSort}</p>}
        </>
    );
};

export default SortPlaces;

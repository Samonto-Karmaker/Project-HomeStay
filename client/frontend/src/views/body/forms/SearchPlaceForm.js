import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import commonAmenities from "../../../utilities/commonAmenities";
import RegularBtn from "../../../components/reusable/RegularBtn";

const ACTIONS = {
    SET_VALUE: "set-value",
    SET_AMENITIES: "set-amenities",
    SET_NUMERIC: "set-numeric",
};

const initialState = {
    country: "",
    city: "",
    minPrice: 0,
    maxPrice: 0,
    minCapacity: 0,
    minRating: 0,
    amenities: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_VALUE: {
            return { ...state, [action.field]: action.payload };
        }
        case ACTIONS.SET_AMENITIES: {
            return { ...state, [action.field]: [...action.payload] };
        }
        case ACTIONS.SET_NUMERIC: {
            return {...state, [action.field]: isNaN(action.payload) ? 0 : parseInt(action.payload)}
        }
        default:
            return state;
    }
};

const SearchPlaceForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {
        country,
        city,
        minPrice,
        maxPrice,
        minCapacity,
        minRating,
        amenities,
    } = state;
    const navigate = useNavigate();

    const amenitiesOptions = commonAmenities.map((amenity) => {
        return { value: amenity, label: amenity };
    });

    const handleInputChange = (e) => {
        dispatch({
            type: ACTIONS.SET_VALUE,
            field: e.target.name,
            payload: e.target.value,
        });
    };

    const handleSelectChange = (selectedOptions) => {
        dispatch({
            type: ACTIONS.SET_AMENITIES,
            field: "amenities",
            payload: selectedOptions.map((option) => option.value),
        });
    };

    const handleNumericInputChange = (e) => {
        dispatch({
            type: ACTIONS.SET_NUMERIC,
            field: e.target.name,
            payload: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(state);

        try {
            const response = await fetch("/api/places/search", {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(state),
            });
            const result = await response.json();
            console.log(result);
            if (result.success) {
                console.log(result.places);
                navigate("/", { state: { searchedPlaces: result.places } });
            } else {
                console.log(result.message);
                window.alert(result.message);
            }
        } catch (err) {
            console.log(err);
            window.alert("Something went wrong");
        }
    };

    return (
        <Form
            style={{ textAlign: "left", padding: "25px" }}
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Form.Group controlId="Country">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Country
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Destination Country"
                                name="country"
                                value={country}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="City">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                City
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Destination City"
                                name="city"
                                value={city}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Form.Group controlId="minPrice">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Minimum Price Per Night in $
                            </Form.Label>
                            <Form.Control
                                type="Number"
                                name="minPrice"
                                value={minPrice}
                                min={0}
                                onChange={handleNumericInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="maxPrice">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Maximum Price Per Night in $
                            </Form.Label>
                            <Form.Control
                                type="Number"
                                name="maxPrice"
                                value={maxPrice}
                                min={0}
                                onChange={handleNumericInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Form.Group controlId="minCapacity">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Minimum Number of Bedrooms
                            </Form.Label>
                            <Form.Control
                                type="Number"
                                name="minCapacity"
                                value={minCapacity}
                                min={0}
                                onChange={handleNumericInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="minRating">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Minimum Rating
                            </Form.Label>
                            <Form.Control
                                type="Number"
                                name="minRating"
                                value={minRating}
                                min={0}
                                max={5}
                                onChange={handleNumericInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="amenities" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>
                    Amenities
                </Form.Label>
                <Select
                    isMulti
                    name="amenities"
                    options={amenitiesOptions}
                    onChange={handleSelectChange}
                />
            </Form.Group>
            <RegularBtn type="submit" style={{ marginTop: "20px" }}>
                Search
            </RegularBtn>
        </Form>
    );
};

export default SearchPlaceForm;

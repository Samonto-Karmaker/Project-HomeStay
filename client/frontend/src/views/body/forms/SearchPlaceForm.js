import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import commonAmenities from "../../../utilities/commonAmenities";
import RegularBtn from "../../../components/reusable/RegularBtn";

const SearchPlaceForm = () => {
    const amenitiesOptions = commonAmenities.map((amenity) => {
        return { value: amenity, label: amenity };
    });

    return (
        <Form style={{ textAlign: "left", padding: "25px" }}>
            <Form.Group>
                <Row style={{ marginTop: "20px" }}>
                    <Col>
                        <Form.Group controlId="City">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                City
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="Country">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Country
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter country"
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
                            <Form.Control type="Number" value={0} min={0} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="minPrice">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Maximum Price Per Night in $
                            </Form.Label>
                            <Form.Control type="Number" value={0} min={0} />
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
                            <Form.Control type="Number" value={0} min={0} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="minRating">
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Minimum Rating
                            </Form.Label>
                            <Form.Control
                                type="Number"
                                value={0}
                                min={0}
                                max={5}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="amenities" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>
                    Amenities
                </Form.Label>
                <Select isMulti name="amenities" options={amenitiesOptions} />
            </Form.Group>
            <RegularBtn type="submit" style={{ marginTop: "20px" }}>
                Search
            </RegularBtn>
        </Form>
    );
};

export default SearchPlaceForm;

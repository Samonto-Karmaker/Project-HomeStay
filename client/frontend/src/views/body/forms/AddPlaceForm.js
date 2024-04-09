import React, { useState, useContext } from "react";
import Select from "react-select";
import { UserContext } from "../../../components/context/UserContext";
import { Form, Row, Col } from "react-bootstrap";
import commonAmenities from "../../../utilities/commonAmenities";
import RegularBtn from "../../../components/reusable/RegularBtn";

const AddPlaceForm = () => {
    const { User } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        country: "",
        price: "",
        capacity: "",
        description: "",
        amenities: [],
        images: [],
    });

    const amenitiesOptions = commonAmenities.map((amenity) => {
        return { value: amenity, label: amenity };
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleAmenitiesChange = (selectedOptions) => {
        setFormData({
            ...formData,
            amenities: selectedOptions.map((option) => option.value),
        });
    };

    const handleImagesChange = (event) => {
        setFormData({
            ...formData,
            images: [...formData.images, ...Array.from(event.target.files)],
        });
        console.log(formData.images);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
    };

    if (!User)
        return (
            <h1 style={{ color: "red" }}>
                {" "}
                401 : Please login to see this page!{" "}
            </h1>
        );

    return (
        <Form
            style={{ textAlign: "left", padding: "25px" }}
            onSubmit={handleSubmit}
        >
            <Form.Group controlId="name">
                <Form.Label style={{ fontWeight: "bold" }}>
                    Place Name
                </Form.Label>
                <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter place name (Pro tip: Make it catchy)"
                    value={formData.name}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="city" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>City</Form.Label>
                <Form.Control
                    name="city"
                    type="text"
                    placeholder="Enter city e.g. Bali, Paris, New York etc."
                    value={formData.city}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="country" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>Country</Form.Label>
                <Form.Control
                    name="country"
                    type="text"
                    placeholder="Enter country e.g. Indonesia, France, USA etc."
                    value={formData.country}
                    onChange={handleChange}
                />
            </Form.Group>
            <Row style={{ marginTop: "20px" }}>
                <Col>
                    <Form.Group controlId="price">
                        <Form.Label style={{ fontWeight: "bold" }}>
                            Price
                        </Form.Label>
                        <Form.Control
                            name="price"
                            type="number"
                            placeholder="Enter price per night"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="capacity">
                        <Form.Label style={{ fontWeight: "bold" }}>
                            Number of Bedrooms
                        </Form.Label>
                        <Form.Control
                            name="capacity"
                            type="number"
                            placeholder="Enter number of bedrooms"
                            value={formData.capacity}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="description" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>
                    Description
                </Form.Label>
                <Form.Control
                    name="description"
                    as="textarea"
                    style={{
                        resize: "vertical",
                        minHeight: "100px",
                        maxHeight: "300px",
                    }}
                    placeholder="Write short description of your place"
                    value={formData.description}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="amenities" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>
                    Amenities
                </Form.Label>
                <Select
                    isMulti
                    name="amenities"
                    options={amenitiesOptions}
                    onChange={handleAmenitiesChange}
                />
            </Form.Group>
            <Form.Group controlId="images" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>Images</Form.Label>
                <Form.Control
                    name="images"
                    type="file"
                    multiple
                    onChange={handleImagesChange}
                />
            </Form.Group>
            {formData.images &&
                Array.from(formData.images).map((file, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                marginTop: "10px",
                                marginRight: "10px",
                                filter: "blur(0.5px)",
                            }}
                        />
                        <RegularBtn
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                        >
                            X
                        </RegularBtn>
                    </div>
                ))}
            <div>
                <RegularBtn type="submit" style={{ marginTop: "20px" }}>
                    Add Place
                </RegularBtn>
            </div>
        </Form>
    );
};

export default AddPlaceForm;

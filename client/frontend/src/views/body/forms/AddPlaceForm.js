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
    };

    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((image, idx) => idx !== index),
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("ownerId", User.userId);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("capacity", formData.capacity);
        formDataToSend.append("description", formData.description);

        formData.amenities.forEach((amenity) => {
            formDataToSend.append("amenities", amenity);
        });
        formData.images.forEach((image) => {
            formDataToSend.append("images", image);
        });

        try {
            const response = await fetch("/api/places/add", {
                method: "POST",
                credentials: "include",
                body: formDataToSend,
            });

            const result = await response.json();
            if (result.success) {
                window.alert("Place added successfully!");
                setFormData({
                    name: "",
                    city: "",
                    country: "",
                    price: "",
                    capacity: "",
                    description: "",
                    amenities: [],
                    images: [],
                });
            } else {
                window.alert(result.message);
            }
        } catch (err) {
            window.alert("Something went wrong");
            console.log(err);
        }
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
                    required
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
                    required
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
                    required
                />
            </Form.Group>
            <Row style={{ marginTop: "20px" }}>
                <Col>
                    <Form.Group controlId="price">
                        <Form.Label style={{ fontWeight: "bold" }}>
                            Price Per Night (in $)
                        </Form.Label>
                        <Form.Control
                            name="price"
                            type="number"
                            placeholder="Enter price per night"
                            value={formData.price}
                            onChange={handleChange}
                            required
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
                            min={1}
                            placeholder="Enter number of bedrooms"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
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
                    required
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
                    required
                />
            </Form.Group>
            <Form.Group controlId="images" style={{ marginTop: "20px" }}>
                <Form.Label style={{ fontWeight: "bold" }}>Images</Form.Label>
                <Form.Control
                    name="images"
                    type="file"
                    multiple
                    onChange={handleImagesChange}
                    required
                />
            </Form.Group>
            {formData.images &&
                Array.from(formData.images).map((file, index) => (
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
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
                            onClick={() => handleImageDelete(index)}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                borderRadius: "50%",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
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

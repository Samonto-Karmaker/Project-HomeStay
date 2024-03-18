import React from "react";
import { Card } from "react-bootstrap";

const UserInfo = ({user}) => {
    return (
        <Card
            bg="light"
            text="dark"
            style={{ 
                width: "25rem",
                margin: "35px auto",
                padding: "15px",
                borderRadius: "20px",
                border: "2px solid #f8f9fa",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            }}
            className="mb-2"
        >
            <Card.Header style={{
                fontSize: "30px",
                color: "red",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                borderBottom: "2px solid #f8f9fa",
            }}
            >
                Profile
            </Card.Header>
            <Card.Body>
                <Card.Title
                    style={{
                        fontSize: "25px",
                        fontFamily: "Fantasy",
                        paddingBottom: "10px",
                        backgroundColor: "white !important",
                    }}
                >
                    {user.name}
                </Card.Title>
                <Card.Text>
                    Email: {user.email}
                </Card.Text>
                <Card.Text>
                    Mobile: {user.mobile}
                </Card.Text>
                <Card.Text>
                    Is Owner: {user.isOwner ? "Yes" : "No"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default UserInfo;
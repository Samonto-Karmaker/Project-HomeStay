import React from "react";

const PageNotFound = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                marginTop: "5vh",
            }}
        >
            <img
                src="/page-not-found.jpg"
                alt="Page Not Found"
                style={{ width: "75%" }}
            />
        </div>
    );
};

export default PageNotFound;

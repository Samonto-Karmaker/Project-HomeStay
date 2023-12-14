import React from "react";
import { Button } from "react-bootstrap";

const NavUserBtn = ({ children, style, ...props }) => {
  return (
    <Button
      className="NavUserBtn"
      style={{
        margin: "10px",
        backgroundColor: "#f8f9fa",
        borderColor: "#f8f9fa",
        borderStyle: "solid",
        borderWidth: "1px",
        color: "red",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default NavUserBtn;

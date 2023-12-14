import React from 'react';
import { Button } from 'react-bootstrap';

const RegularBtn = ({ children, style, ...props }) => {
    return (
        <Button
            className='RegularBtn'
            style={{
                marginTop: "10px",
                marginBottom: "10px",
                backgroundColor: "red", 
                color: "white",
                borderColor: "white",
                ...style,
            }}
            {...props}
        >
            {children}
        </Button>
    );
}

export default RegularBtn;
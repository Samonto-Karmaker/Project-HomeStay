import React from "react";
import { Image } from "react-bootstrap";

const UserAvatar = ({ avatar, style }) => {
    return (
        <>
            {avatar ? (
                <Image
                    variant="top"
                    src={avatar}
                    alt="User Avatar"
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        display: "block",
                        border: "3px solid red",
                        margin: "0 auto 20px auto",
                        ...style,
                    }}
                />
            ) : (
                <Image
                    variant="top"
                    src="/no-photo.png"
                    alt="No Avatar"
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        display: "block",
                        border: "3px solid red",
                        margin: "0 auto 20px auto",
                        ...style,
                    }}
                />
            )}
        </>
    );
};

export default UserAvatar;

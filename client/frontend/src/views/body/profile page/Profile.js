import React from "react";
import UserInfo from "./UserInfo";
import OwnerDashBoard from "./OwnerDashBoard";
import UserDashBoard from "./UserDashBoard";

const Profile = () => {
    return (
        <div>
            <UserInfo />
            <OwnerDashBoard />
            <UserDashBoard />
        </div>
    );
}

export default Profile;
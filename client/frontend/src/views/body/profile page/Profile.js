import React from "react";
import UserInfo from "./UserInfo";
import OwnerDashBoard from "./OwnerDashBoard";
import UserDashBoard from "./UserDashBoard";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../components/context/UserContext";

const Profile = () => {

    const { User, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(User) setIsLoading(false);
    }, [User])
    
    if(isLoading) return <div>...Loading</div>

    return (
        <div>
            <UserInfo user = {User} setUser = {setUser} />
            <OwnerDashBoard />
            <UserDashBoard />
        </div>
    );
}

export default Profile;
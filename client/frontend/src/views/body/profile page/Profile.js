import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../../components/context/UserContext";
import UserInfo from "./UserInfo";
import OwnerDashBoard from "./OwnerDashBoard";
import UserDashBoard from "./UserDashBoard";

const Profile = () => {
  const { User, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isUser, setIsUser] = useState(true);

  const location = useLocation();
  const owner = location.state ? location.state.owner : undefined;

  useEffect(() => {
    if (User) {
      if (owner && owner._id !== User.userId) {
        setIsUser(false);
      } else {
        setIsUser(true);
      }
      setIsLoading(false);
    }
  }, [User, owner]);

  if (isLoading) return <h1 style={{color: "red"}}> 401 : Please login to see this page! </h1>;
  if (!isUser && !owner) return <div>...Loading</div>;

  return (
    <div>
      <UserInfo
        isUser={isUser}
        user={isUser ? User : owner}
        setUser={isUser ? setUser : null}
      />
      <br />
      <OwnerDashBoard isUser={isUser} user={isUser ? User : owner} />
      <br />
      {isUser && <UserDashBoard />}
      <br />
    </div>
  );
};

export default Profile;

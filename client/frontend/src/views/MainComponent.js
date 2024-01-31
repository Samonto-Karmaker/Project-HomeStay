import React, {useEffect, useContext} from "react";
import { UserContext } from "../components/context/UserContext";

import Header from "./header/Header";
import Body from "./body/Body";
import Footer from "./footer/Footer";

const MainComponent = () => {

  const {setUser} = useContext(UserContext);

  const fetchUserInfo = async () => {
    try{
      const response = await fetch('/api/check-authentication', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if(result.success){
        setUser(result.loggedInUser);
      }
      else{
        setUser(null);
      }
    }
    catch(err){
      window.alert("Something went wrong");
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <div className="main-component">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default MainComponent;
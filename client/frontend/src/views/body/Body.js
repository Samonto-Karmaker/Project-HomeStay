import React from "react";
import { Route, Routes } from "react-router";
import Places from "./home page/Places";
import PlaceDetails from "./place details/PlaceDetails";
import Profile from "./profile page/Profile";

const Body = () => {
  return (
    <div className="body">
      <Routes>
        <Route exact path="/" element={<Places />} />
        <Route exact path="/place/:id" element={<PlaceDetails />} />
        <Route exact path="/user/:id" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Body;

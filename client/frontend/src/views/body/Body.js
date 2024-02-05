import React from "react";
import { Route, Routes } from "react-router";
import Places from "./home page/Places";
import PlaceDetails from "./PlaceDetails";

const Body = () => {
  return (
    <div className="body">
      <Routes>
        <Route exact path="/" element={<Places />} />
        <Route exact path="/place/:id" element={<PlaceDetails />} />
      </Routes>
    </div>
  );
};

export default Body;

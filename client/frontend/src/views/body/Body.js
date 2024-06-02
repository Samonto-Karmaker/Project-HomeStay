import React from "react";
import { Route, Routes } from "react-router";
import Places from "./home page/Places";
import PlaceDetails from "./place details/PlaceDetails";
import Profile from "./profile page/Profile";
import AddPlaceForm from "./forms/AddPlaceForm";
import SearchPlaceForm from "./forms/SearchPlaceForm";

const Body = () => {
  return (
    <div className="body">
      <Routes>
        <Route exact path="/" element={<Places />} />
        <Route exact path="/place/:id" element={<PlaceDetails />} />
        <Route exact path="/user/:id" element={<Profile />} />
        <Route exact path="/add-place" element={<AddPlaceForm />} />
        <Route exact path="/search-place" element={<SearchPlaceForm />} />
        <Route path="*" element={
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            marginTop: "5vh"
          }}>
            <img src="/page-not-found.jpg" alt="Page Not Found" style={{ width: "75%" }} />
          </div>
        } />
      </Routes>
    </div>
  );
};

export default Body;

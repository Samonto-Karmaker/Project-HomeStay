import React from "react";
import { Route, Routes } from "react-router";
import Places from "./home page/Places";
import PlaceDetails from "./place details/PlaceDetails";
import Profile from "./profile page/Profile";
import AddPlaceForm from "./forms/AddPlaceForm";
import SearchPlaceForm from "./forms/SearchPlaceForm";
import PageNotFound from "../../components/reusable/PageNotFound";

const Body = () => {
    return (
        <div className="body">
            <Routes>
                <Route exact path="/" element={<Places />} />
                <Route exact path="/place/:id" element={<PlaceDetails />} />
                <Route exact path="/user/:id" element={<Profile />} />
                <Route exact path="/add-place" element={<AddPlaceForm />} />
                <Route
                    exact
                    path="/search-place"
                    element={<SearchPlaceForm />}
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
};

export default Body;

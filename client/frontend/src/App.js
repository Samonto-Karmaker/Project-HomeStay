import React from "react";
import "./App.css";
import { UserProvider } from "./components/context/UserContext";
import { BrowserRouter } from "react-router-dom";
import MainComponent from "./views/MainComponent";

const App = () => {
  return (
    <UserProvider>
      <div className="App">
        <BrowserRouter>
          <MainComponent />
        </BrowserRouter>
      </div>
    </UserProvider>
  );
};

export default App;

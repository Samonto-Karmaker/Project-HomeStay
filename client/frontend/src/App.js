import React from "react";
import "./App.css";
import { UserProvider } from "./components/context/UserContext";

import MainComponent from "./views/MainComponent";

const App = () => {
  return (
    <UserProvider>
      <div className="App">
        <MainComponent />
      </div>
    </UserProvider>
  );
};

export default App;

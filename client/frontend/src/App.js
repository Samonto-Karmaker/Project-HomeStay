import React from "react";
import "./App.css";
import { UserProvider } from "./components/context/UserContext";
import { BrowserRouter } from "react-router-dom";
import MainComponent from "./views/MainComponent";
import { SocketProvider } from "./components/context/SocketContext";

const App = () => {
    return (
        <UserProvider>
            <SocketProvider>
                <div className="App">
                    <BrowserRouter>
                        <MainComponent />
                    </BrowserRouter>
                </div>
            </SocketProvider>
        </UserProvider>
    );
};

export default App;

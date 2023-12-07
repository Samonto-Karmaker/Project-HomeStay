import React, {useState} from "react";

const UserContext = React.createContext();

const UserProvider = ({children}) => {
    const [User, setUser] = useState(null);

    return(
        <UserContext.Provider value={{User, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext, UserProvider};
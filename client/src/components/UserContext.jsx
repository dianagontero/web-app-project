import API from "../API.mjs";
import { useEffect, createContext, useState } from "react";


const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await API.getCurrentUser();
                if (userData.success === false) {
                    setUser(null);
                } else {
                setUser(userData.user);
                }
            } catch (error) {
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await API.Login(email, password);
            if (userData.success === false) {
                return {
                    message: userData.message 
                }
            }
            setUser(userData.user);
            return ({
                success: true,
                message: "welcome " + userData.name + " " + userData.surname,
            })
        } catch (error) {

            return {
                success: false,
                message: error.message || "Login failed. Please try again."
            };
        }
    };

    const logout = async () => {
        try {
            await API.Logout();
            setUser(null);
        } catch (error) {
            console.log("Logout failed:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout}}>
            {children}
        </UserContext.Provider>
    );   
}

export {UserContext};
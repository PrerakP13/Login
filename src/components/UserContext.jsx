import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ role: "visitor" });

    // Memoize fetchUserRole so its reference doesn't change on every render
    const fetchUserRole = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8000/home", { withCredentials: true });
            setUser({ role: response.data.role });
        } catch (e) {
            console.error("Failed to fetch user role:", e);
        }
    }, []);

    useEffect(() => {
        fetchUserRole();
    }, [fetchUserRole]); // This will now only run once on mount

    return (
        <UserContext.Provider value={{ user, setUser, fetchUserRole }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Verify token with backend
                const res = await axios.get(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser({ token, ...res.data });
            } catch (error) {
                console.error("Auth verification failed:", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE}/api/auth/login`, {
            email,
            password,
        });
        localStorage.setItem("token", res.data.token);
        setUser({ token: res.data.token, ...res.data.user });
        return res.data;
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_BASE}/api/auth/signup`, {
            name,
            email,
            password,
        });
        localStorage.setItem("token", res.data.token);
        setUser({ token: res.data.token, ...res.data.user });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

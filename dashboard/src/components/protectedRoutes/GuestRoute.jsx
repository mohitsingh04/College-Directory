import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API } from "../../services/API";

const GuestRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await API.get("/token");
                setUser(res.data);
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) return null;
    return user ? <Navigate to="/dashboard" /> : children;
};

export default GuestRoute;

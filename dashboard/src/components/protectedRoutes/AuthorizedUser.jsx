import React, { useEffect, useState } from 'react';
import { API } from '../../services/API';
import { useNavigate } from 'react-router-dom';

const AuthorizedUser = ({ children }) => {
    const navigate = useNavigate();
    const [User, setUser] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const { data } = await API.get("/profile");
                setUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        getUserData();
    }, []);

    if (User?.role !== "Super Admin" && User?.role === "Admin") {
        // return <div className='position-absolute top-50 start-50 translate-middle'>USER DOES NOT HAVE THE RIGHT ROLES.</div>
        return navigate("/dashboard");
    } else {
        return children;
    }
};

export default AuthorizedUser;

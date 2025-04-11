import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { API } from "../../../services/API";
import toast from "react-hot-toast";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error("Invalid or missing token.");
        }
    }, []);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) return;

            setLoading(true);
            try {
                const response = await API.post("/verifyemail", { token });

                Swal.fire({
                    title: "Verified!",
                    text: response.data.message,
                    icon: "success",
                    timer: 2000,
                }).then(() => {
                    navigate("/login");
                });
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error(error.response.data.error || "Bad Request");
                        setError(error.response.data.error);
                    } else if (error.response.status === 500) {
                        toast.error("Internal server error, please try again later.");
                    } else {
                        toast.error("Something went wrong, please try again.");
                    }
                } else {
                    toast.error(`Submission failed: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="position-absolute top-50 start-50 translate-middle text-light">
            {loading ? <p>Verifying...</p> : <h1>{error}</h1>}
        </div>
    );
}

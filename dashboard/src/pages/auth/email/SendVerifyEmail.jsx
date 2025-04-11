import React, { Fragment, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ALLImages from '../../../common/Imagesdata';
import toast from 'react-hot-toast';
import { API } from '../../../services/API';

export default function SendVerifyEmail() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/user");
                const filterData = response.data.filter((user) => user.email === email)
                setUser(filterData);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error(error.response.data.error || "Bad Request");
                    } else if (error.response.status === 401) {
                        toast.error(error.message);
                    } else if (error.response.status === 500) {
                        toast.error("Internal server error, please try again later.");
                    }
                    else {
                        toast.error("Something went wrong, please try again.");
                    }
                } else {
                    toast.error(`Registration failed: ${error.message}`);
                }
            }
        };

        fetchUser();
    }, []);

    if (user[0]?.isVerified === true) {
        navigate("/login");
    }

    return (
        <>
            <Fragment>
                <div className="col-login mx-auto">
                    <div className="text-center">
                        <img src={ALLImages("logo9")} className="header-brand-img" alt="Logo" />
                    </div>
                </div>

                <div className="container-login100">
                    <Card className="wrap-login100 p-0" style={{ height: "300px", width: "500px" }}>
                        <Card.Body>
                            <div className='text-center' style={{ marginTop: "50px" }}>
                                <h4>Verify your email</h4>
                                <p className='my-4'>
                                    A verification email has been sent to your email address. The verification email will expire after 24 hours.
                                </p>
                                <p>
                                    Didn’t receive an email? <span type="button"><u>Resend the verification email</u></span>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Fragment>
        </>
    )
}

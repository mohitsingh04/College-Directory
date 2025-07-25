import React, { useState, Fragment, useRef, useEffect } from "react";
import { Tab, Card, Row, Col, Nav, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { API } from "../../services/API";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function Profile() {
    const [user, setUser] = useState(null);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getUserData = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get("/profile");
                setUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                stopLoadingBar();
            }
        }

        getUserData();
    }, []);

    useEffect(() => {
        document.title = "AJ | Profile";
    }, []);

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">Profile</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Profile</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            {user
                ?
                <>
                    <div>
                        <Row id="user-profile">
                            <Col lg={12}>
                                <Card className="custom-card">
                                    <Card.Body>
                                        <div className="wideget-user mb-4">
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <div className="wideget-user-desc d-sm-flex">
                                                        <div className="wideget-user-img">
                                                            {user?.profile_image ? (
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`}
                                                                    alt="Profile Image Preview"
                                                                    className="mt-2 rounded-circle"
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    className="rounded-circle"
                                                                    width={100}
                                                                    height={100}
                                                                    src={ALLImages('face8')}
                                                                    alt="img"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="user-wrap ms-3 mt-auto">
                                                            <h4>{user?.name}</h4>
                                                            <h6 className="text-muted mb-3">({user?.role})</h6>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col md={6} className="text-md-end mt-3 mt-md-0">
                                                    <Link to={`/dashboard/edit-profile`} className="btn btn-primary">
                                                        Edit Profile
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </div>

                                        <Row>
                                            <hr />
                                            <Col md={6}>
                                                <p><strong>Full Name:</strong> {user?.name}</p>
                                                <p><strong>Phone:</strong> {user?.phone}</p>
                                                <p><strong>Email:</strong> {user?.email}</p>
                                                <p>
                                                    {user?.isVerified === true
                                                        ? <p className="badge bg-success">Verified</p>
                                                        : <p className="badge bg-danger">Not Verified</p>
                                                    }
                                                </p>
                                            </Col>
                                            <Col md={6}>
                                                <p><strong>Address:</strong> {user?.address}</p>
                                                <p><strong>Pincode:</strong> {user?.pincode}</p>
                                                <p><strong>City:</strong> {user?.city}</p>
                                                <p><strong>State:</strong> {user?.state}</p>
                                                <p><strong>Country:</strong> {user?.country}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
                :
                <Skeleton height={300} />
            }
        </Fragment>
    )
};
import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";
import { API } from "../../services/API";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function ViewStatus() {
    const navigate = useNavigate();
    const { Id } = useParams();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const loadingBarRef = useRef(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getAuthUserData = async () => {
            try {
                setHandlePermissionLoading(true)
                const { data } = await API.get("/profile");
                setAuthUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setHandlePermissionLoading(false)
            }
        }

        getAuthUserData();
    }, []);

    useEffect(() => {
        const getStatus = async () => {
            try {
                startLoadingBar();
                setLoading(true);
                const { data } = await API.get(`/status/${Id}`);
                setStatus(data[0] || {});
            } catch (error) {
                setError('Failed to load status');
                toast.error('Error fetching status');
            } finally {
                stopLoadingBar();
                setLoading(false);
            }
        };

        getStatus();
    }, [Id]);

    if (error) return <p>{error}</p>;

    useEffect(() => {
        document.title = "AJ | View Status";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Status"
    );

    if (!handlePermissionLoading && authUser) {
        if (!hasPermission) {
            return (
                <div className="position-absolute top-50 start-50 translate-middle">
                    USER DOES NOT HAVE THE RIGHT ROLES.
                </div>
            );
        }
    }

    const handleRedirect = (_id) => {
        navigate("/dashboard/status/edit/" + _id);
    }

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div>
                    <h1 className="page-title fw-semibold fs-20 mb-0">View Status</h1>
                    <div>
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard/status'}>
                                    Status
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>View</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">View Status</h3>
                    <div className="card-options ms-auto">
                        <button type="button" className="btn btn-md btn-success me-1" onClick={() => handleRedirect(status?._id)}>
                            <i className="fe fe-edit"></i> Edit
                        </button>
                        <Link to={"/dashboard/status"}>
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <>
                            <Skeleton width={300} />
                            <Skeleton width={300} className="mt-3" />
                            <Skeleton count={3} className="mt-3" />
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: "14 px" }}>
                                <p>Status: {status?.parent_status || 'N/A'}</p>
                                <p>Parent Status: {status?.status_name || 'N/A'}</p>
                                <p>Description: {status?.description || 'N/A'}</p>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

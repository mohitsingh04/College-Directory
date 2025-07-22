import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';
import ALLImages from "../../common/Imagesdata";

export default function ViewCategory() {
    const navigate = useNavigate();
    const { objectId } = useParams();
    const [category, setCategory] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const loadingBarRef = useRef(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState();

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
        const getCategory = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get(`/category/${objectId}`);
                setCategory(data);
            } catch (error) {
                toast.error('Error fetching category: ' + error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getCategory();
    }, [objectId]);

    const toggleReadMore = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        document.title = "AJ | View Category";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Category"
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
        navigate("/dashboard/category/edit/" + _id);
    }

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">View Category</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard/category'}>
                                    Category
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>View</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">View Category Details</h3>
                    <div className="card-options ms-auto">
                        <button type="button" className="btn btn-md btn-success me-1" onClick={() => handleRedirect(category?._id)}>
                            <i className="fe fe-edit"></i> Edit
                        </button>
                        <Link to="/dashboard/category">
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div>
                        {category ? (
                            <>
                                <div className="mb-1">
                                    {category?.status === "Active"
                                        ? <span className="badge bg-success">Active</span>
                                        : category?.status === "Suspended"
                                            ? <span className="badge bg-danger">Suspended</span>
                                            : category?.status === "Pending"
                                                ? <span className="badge bg-warning">Pending</span>
                                                : <span className="badge bg-secondary">Unknown</span>
                                    }
                                </div>
                                {category?.featured_image && (
                                    category.featured_image === "image.png" ? (
                                        <img src={ALLImages('logo4')} alt="logo" className="Category Logo mb-3 w-96 h-40" />
                                    ) : (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${category.featured_image}`}
                                            alt="Featured Image Preview"
                                            onError={(e) => { e.target.src = <Skeleton />; }}
                                            className="mb-3 w-96 h-40"
                                        />
                                    )
                                )}
                                {category?.logo && (
                                    category.logo === "image.png" ? (
                                        <img src={ALLImages('noImage')} width={100} height={80} alt="logo" className="Category Logo" />
                                    ) : (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${category.logo}`}
                                            alt="Logo Preview"
                                            className="mb-3"
                                            width={56}
                                            onError={(e) => { e.target.src = <Skeleton />; }}
                                        />
                                    )
                                )}
                                <h3 className="mt-3">{category.parent_category}  ({category.category_name})</h3>
                                <div style={{ fontSize: "16px" }}>
                                    <h6 className="mt-3">Description:</h6>
                                    {category.description.length >= 1500 ? (
                                        <>
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpanded
                                                        ? category.description
                                                        : category.description.substring(0, 1200) + "...",
                                                }}
                                            />
                                            <button
                                                onClick={toggleReadMore}
                                                className="text-blue-700 underline"
                                            >
                                                {isExpanded ? "Read Less" : "Read More"}
                                            </button>
                                        </>
                                    ) : (
                                        <p
                                            dangerouslySetInnerHTML={{ __html: category.description }}
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton width={450} height={300} />
                                <Skeleton width={56} height={56} className="mt-3" />
                                <h3 className="mt-3"><Skeleton width={300} /></h3>
                                <p style={{ fontSize: "16px" }}><Skeleton count={3} /></p>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
}

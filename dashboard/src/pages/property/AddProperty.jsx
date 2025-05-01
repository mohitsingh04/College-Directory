import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Breadcrumb, Button, Row, Col, Form } from "react-bootstrap";
import College from "./propertyTypes/College";
import University from "./propertyTypes/University";
import toast from "react-hot-toast";
import { API } from "../../services/API";

export default function AddProperty() {
    const [type, setType] = useState("");
    const [authUser, setAuthUser] = useState(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

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
        document.title = "AJ | Add Property";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Create Property"
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

    console.log(authUser?.role)

    return (
        <Fragment>
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div>
                    <h1 className="page-title fw-semibold fs-20 mb-0">Add Property</h1>
                    <Breadcrumb className="mb-0">
                        <Breadcrumb.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {authUser?.role === "Property Manager" ? "Property" : <Link to="/dashboard/property">Property</Link>}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title">Add Property</h3>
                    {authUser?.role === "Property Manager"
                        ? null
                        :
                        <Link to="/dashboard/property">
                            <Button variant="primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </Button>
                        </Link>
                    }
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Form.Label>Please select your property type from below options</Form.Label>
                        <Col md={3}>
                            <Card
                                className={`cursor-pointer ${type === "University" ? "border-primary shadow" : "border-secondary"} hover:shadow-2xl transition-shadow duration-300`}
                                onClick={() => setType("University")}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <img width="100" height="100" src="https://img.icons8.com/ios/100/university.png" alt="university" />
                                </div>
                                <Card.Body className="p-2 text-center">
                                    <Card.Title>University</Card.Title>
                                    <Card.Text>
                                        A university offers higher education in various disciplines.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card
                                className={`cursor-pointer ${type === "College" ? "border-primary shadow" : "border-secondary"} hover:shadow-2xl transition-shadow duration-300`}
                                onClick={() => setType("College")}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <img width="100" height="100" src="https://img.icons8.com/ios-glyphs/100/university-campus.png" alt="university-campus" />
                                </div>
                                <Card.Body className="p-2 text-center">
                                    <Card.Title>College</Card.Title>
                                    <Card.Text>
                                        A college provides specialized or general academic courses.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {type && (
                <Card className="custom-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h3 className="card-title">{type === "College" ? "Add College Details" : "Add University Details"}</h3>
                    </Card.Header>
                    <Card.Body>
                        {type === "College" ? <College /> : <University />}
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    );
}

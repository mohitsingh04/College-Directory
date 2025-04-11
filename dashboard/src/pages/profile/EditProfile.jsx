import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, ListGroup, Breadcrumb, Button } from "react-bootstrap";
import ALLImages from "../../common/Imagesdata";
import ChangePassword from "../auth/password/ChangePassword";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function EditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(null);
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);
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

        const getStatesData = async () => {
            try {
                startLoadingBar();
                const response = await API.get("/fetch-states");
                setStates(response?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                stopLoadingBar();
            }
        }

        getUserData();
        getStatesData();
    }, []);

    const initialValues = {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        pincode: user?.pincode || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        profile_image: user?.profile_image || "",
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid'),
        pincode: Yup.string().required("Pincode is required").matches(/^[1-9][0-9]{5}$/, 'Pincode must be a 6-digit number starting with 1-9'),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
    });

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("pincode", values.pincode);
        formData.append("address", values.address);
        formData.append("city", values.city);
        formData.append("state", values.state);
        formData.append("profile_image", values.profile_image);

        try {
            startLoadingBar();
            const response = await API.put(`/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/dashboard/profile');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error, please try again later.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } else {
                toast.error(`Registration failed: ${error.message}`);
            }
        } finally {
            stopLoadingBar();
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const handleFileChange = (e, setFieldValue, fieldName, setPreview) => {
        const file = e.currentTarget.files[0];
        setFieldValue(fieldName, file);
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        document.title = "AJ | Edit Profile";
    }, []);

    const fetchCitiesByState = async (state_name) => {
        if (!state_name) {
            setCity([]);
            return;
        }
        try {
            const response = await API.get(`/fetch-city`);
            setCity(response?.data.filter((items) => items.state_name === state_name));
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCitiesByState(formik.values.state);
    }, [formik.values.state]);

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">Edit Profile</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard/profile'}>
                                    Profile
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Edit Profile</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Row>
                {user ? (
                    <>
                        <Col xl={4} md={12} sm={12}>
                            <Card className="custom-card edit-password-section">
                                <Card.Header>
                                    <div className="card-title">Change Password</div>
                                </Card.Header>
                                <Card.Body>
                                    <ChangePassword />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={8} md={12} sm={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <h3 className="card-title">Edit Profile</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                                        <Row>
                                            <Col className="mb-4" xl={12} md={12} sm={12}>
                                                <Row>
                                                    <Col xl={2} md={12} sm={12}>
                                                        {previewProfile
                                                            ? <img src={previewProfile} alt="Logo Preview" className="rounded-circle" width={80} />
                                                            : user?.profile_image
                                                                ? <img src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`} alt="Profile Image Preview" className="rounded-circle" width={80} height={80} />
                                                                : <img className="rounded-circle" width={80} src={ALLImages('face8')} alt="img" />
                                                        }
                                                    </Col>
                                                    <Col xl={10} md={12} sm={12}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control
                                                                type="file"
                                                                className={`form-control`}
                                                                name="profile_image"
                                                                onChange={(e) => handleFileChange(e, formik.setFieldValue, "profile_image", setPreviewProfile)}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="userName">Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        id="userName"
                                                        placeholder="Name"
                                                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                                        name="name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.errors.name && formik.touched.name ? <div className="text-danger">{formik.errors.name}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputEmail1">Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        id="exampleInputEmail1"
                                                        placeholder="Email"
                                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        disabled
                                                    />
                                                    {formik.errors.email && formik.touched.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputnumber">Phone</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        id="exampleInputnumber"
                                                        placeholder="Phone"
                                                        className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                                                        name="phone"
                                                        value={formik.values.phone}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        disabled
                                                    />
                                                    {formik.errors.phone && formik.touched.phone ? <div className="text-danger">{formik.errors.phone}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={8} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputaddress">Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        id="exampleInputaddress"
                                                        placeholder="Address"
                                                        className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                                        name="address"
                                                        value={formik.values.address}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.errors.address && formik.touched.address ? <div className="text-danger">{formik.errors.address}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputpincode">Pincode</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        id="exampleInputpincode"
                                                        placeholder="Pincode"
                                                        className={`form-control ${formik.touched.pincode && formik.errors.pincode ? 'is-invalid' : ''}`}
                                                        name="pincode"
                                                        value={formik.values.pincode}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.errors.pincode && formik.touched.pincode ? <div className="text-danger">{formik.errors.pincode}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={6} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputState">State</Form.Label>
                                                    <Form.Select
                                                        name="state"
                                                        value={formik.values.state}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map((items) => (
                                                            <option key={items.id} value={items.name}>{items.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {formik.errors.state && formik.touched.state ? <div className="text-danger">{formik.errors.state}</div> : null}
                                                </Form.Group>
                                            </Col>
                                            <Col xl={6} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputcity">City</Form.Label>
                                                    <Form.Select
                                                        name="city"
                                                        value={formik.values.city}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    >
                                                        <option value="">Select City</option>
                                                        {city.map((items) => (
                                                            <option key={items.id} value={items.name}>{items.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {formik.errors.city && formik.touched.city ? <div className="text-danger">{formik.errors.city}</div> : null}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className="text-end">
                                            <Button type="submit">Update</Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xl={4} md={12} sm={12}>
                            <Card className="custom-card edit-password-section">
                                <Card.Header>
                                    <div className="card-title"><Skeleton width={129} height={24} /></div>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label><Skeleton width={102} height={20} /></Form.Label>
                                            <Skeleton width={281} height={35} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label><Skeleton width={102} height={20} /></Form.Label>
                                            <Skeleton width={281} height={35} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label><Skeleton width={102} height={20} /></Form.Label>
                                            <Skeleton width={281} height={35} />
                                        </Form.Group>
                                        <hr />
                                        <div className="text-end">
                                            <Skeleton width={70} height={38} />
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={8} md={12} sm={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <h3 className="card-title"><Skeleton width={78} height={24} /></h3>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={formik.handleSubmit}>
                                        <Row>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={637} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputEmail1"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={637} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={12} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputnumber"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={637} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={8} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputaddress"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={416} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={4} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputpincode"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={196} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={6} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputcity"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={306} height={35} />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={6} md={12} sm={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label htmlFor="exampleInputState"><Skeleton width={78} height={24} /></Form.Label>
                                                    <Skeleton width={306} height={35} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className="text-end">
                                            <Button type="submit">Save</Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </Fragment>
    )
};
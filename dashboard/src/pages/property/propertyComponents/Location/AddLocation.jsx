import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";

export default function AddLocation() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);

    useEffect(() => {
        const getStatesData = async () => {
            try {
                const response = await API.get("/fetch-states");
                setStates(response?.data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        getStatesData();
    }, []);

    const initialValues = {
        propertyId: uniqueId,
        address: "",
        pincode: "",
        city: "",
        state: "",
    }

    const validationSchema = Yup.object({
        address: Yup.string().required("Provide a valid address."),
        pincode: Yup.string().required("Provide a valid pincode.").matches(/^[1-9][0-9]{5}$/, 'Pincode must be a 6-digit number starting with 1-9'),
        city: Yup.string().required("Provide a valid city."),
        state: Yup.string().required("Provide a valid state."),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.post(`/location`, values);

            if (response.status === 200) {
                toast.success(response.data.message);
            }
            window.location.reload();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 404) {
                    toast.error(error.response.status);
                } else if (error.response.status === 500) {
                    toast.error("Internal server error, please try again later.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } else {
                toast.error(`Failed: ${error.message}`);
            }
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

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
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Address */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="address">Address</Form.Label>
                            <Form.Control
                                type="text"
                                id="address"
                                placeholder="Address"
                                name="address"
                                className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="text-danger">
                                    {formik.errors.address}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Pincode */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="pincode">Pincode</Form.Label>
                            <Form.Control
                                type="text"
                                id="pincode"
                                placeholder="Pincode"
                                name="pincode"
                                className={`form-control ${formik.touched.pincode && formik.errors.pincode ? 'is-invalid' : ''}`}
                                value={formik.values.pincode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.pincode && formik.errors.pincode ? (
                                <div className="text-danger">
                                    {formik.errors.pincode}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* State */}
                    <Col md={6}>
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
                    {/* City */}
                    <Col md={6}>
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
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}

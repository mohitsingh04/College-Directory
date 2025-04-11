import React, { Fragment, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import { Rating } from "@mui/material";
import PhoneInput from 'react-phone-input-2';

export default function AddReviews() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        name: "",
        email: "",
        phone_number: "",
        rating: "",
        review: "",
        gender: "",
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required."),
        email: Yup.string().required("Email is required."),
        phone_number: Yup.string().required("Phone number is required."),
        rating: Yup.string().required("Rating is required."),
        review: Yup.string().required("Review is required."),
        gender: Yup.string().required("Gender is required."),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.post(`/reviews`, values);

            if (response.status === 200) {
                toast.success(response.data.message);
                window.location.reload();
            }
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

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Name */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="name"
                                placeholder="Name"
                                name="name"
                                className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="text-danger">
                                    {formik.errors.name}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Email */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <Form.Control
                                type="text"
                                id="email"
                                placeholder="Email"
                                name="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">
                                    {formik.errors.email}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Phone number */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="phone_number">Phone number</Form.Label>
                            {/* <Form.Control
                                type="text"
                                id="phone_number"
                                placeholder="Phone number"
                                name="phone_number"
                                className={`form-control ${formik.touched.phone_number && formik.errors.phone_number ? 'is-invalid' : ''}`}
                                value={formik.values.phone_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            /> */}
                            <PhoneInput
                                country={'in'}
                                value={formik.values.phone_number}
                                inputClass={`border w-100 ${formik.touched.phone_number && formik.errors.phone_number ? "border-danger" : ""}`}
                                inputStyle={{ height: "45px" }}
                                buttonClass={`bg-white border ${formik.touched.phone_number && formik.errors.phone_number ? "border-danger" : ""}`}
                                onChange={(value) => formik.setFieldValue("phone_number", value)}
                                onBlur={formik.handleBlur("phone_number")}
                            />
                            {formik.touched.phone_number && formik.errors.phone_number ? (
                                <div className="text-danger">
                                    {formik.errors.phone_number}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Gender */}
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label htmlFor="gender">Gender</Form.Label>
                            {["radio"].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Male"
                                        value="Male"
                                        name="gender"
                                        type={type}
                                        id={`inline-${type}-1`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.gender === "Male"}
                                    />
                                    <Form.Check
                                        inline
                                        label="Female"
                                        value="Female"
                                        name="gender"
                                        type={type}
                                        id={`inline-${type}-2`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.gender === "Female"}
                                    />
                                    <Form.Check
                                        inline
                                        label="Other"
                                        value="Other"
                                        name="gender"
                                        type={type}
                                        id={`inline-${type}-3`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.gender === "Other"}
                                    />
                                </div>
                            ))}
                            {formik.touched.gender && formik.errors.gender && (
                                <div className="text-danger">{formik.errors.gender}</div>
                            )}
                        </Form.Group>
                    </Col>
                    {/* Rating */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="rating">Rating</Form.Label>
                            <br />
                            <Rating
                                name="simple-controlled"
                                value={formik.values.rating}
                                onChange={(_event, newValue) => { formik.setFieldValue('rating', newValue); }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {formik.touched.rating && formik.errors.rating ? (
                                <div className="text-danger">
                                    {formik.errors.rating}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Review */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="review">Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                id="review"
                                placeholder="Review"
                                name="review"
                                className={`form-control ${formik.touched.review && formik.errors.review ? 'is-invalid' : ''}`}
                                value={formik.values.review}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.review && formik.errors.review ? (
                                <div className="text-danger">
                                    {formik.errors.review}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}

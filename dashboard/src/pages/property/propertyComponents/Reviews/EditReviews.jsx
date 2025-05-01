import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import { Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import PhoneInput from 'react-phone-input-2';
import Skeleton from 'react-loading-skeleton';

export default function EditReviews({ reviewsUniqueId }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [reviews, setReviews] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await API.get(`/reviews/${reviewsUniqueId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [reviewsUniqueId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    console.log(reviews)

    const initialValues = {
        propertyId: uniqueId,
        name: reviews[0]?.name || "",
        email: reviews[0]?.email || "",
        phone_number: reviews[0]?.phone_number || "",
        rating: reviews[0]?.rating || "",
        review: reviews[0]?.review || "",
        gender: reviews[0]?.gender || "",
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
            const response = await API.put(`/reviews/${reviewsUniqueId}`, values);

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
        enableReinitialize: true
    });

    return (
        <Fragment>
            {loading
                ?
                <Skeleton height={300} />
                :
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
                                        {["Male", "Female", "Other"].map((gender, index) => (
                                            <Form.Check
                                                key={index}
                                                inline
                                                label={gender}
                                                value={gender}
                                                name="gender"
                                                type={type}
                                                id={`inline-${type}-${index + 1}`}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                checked={formik.values.gender === gender}
                                            />
                                        ))}
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
                    <Button type="submit">Update</Button>
                </Form>
            }
        </Fragment>
    );
}

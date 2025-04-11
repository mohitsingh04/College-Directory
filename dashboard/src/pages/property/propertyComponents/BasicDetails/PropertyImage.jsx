import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";

import ALLImages from "../../../../common/Imagesdata";
import { API } from "../../../../services/API";

export default function PropertyImage() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [PreviewLogo, setPreviewLogo] = useState(null);
    const [PreviewFeaturedImage, setPreviewFeaturedImage] = useState(null);

    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await API.get(`/property/${uniqueId}`);
                setProperty(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load property');
                setLoading(false);
                toast.error('Error fetching property' + error.message);
            }
        };

        getProperty();
    }, [uniqueId]);

    const initialValues = {
        logo: property?.logo || "",
        featured_image: property?.featured_image || "",
    }

    const handleSubmit = async (values) => {
        try {
            if (typeof values.logo == 'object' || typeof values.featured_image == 'object' || typeof values.logo != 'object' && values.featured_image != 'object') {
                let formData = new FormData();
                for (let value in values) {
                    formData.append(value, values[value]);
                }
                const response = await API.put(`/property-files/${uniqueId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    toast.success(response.data.message);
                }
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 404) {
                    toast.error(error.response.data.error || "Not Found");
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
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const handleFileChange = (e, setFieldValue, fieldName, setPreview) => {
        const file = e.currentTarget.files[0];
        setFieldValue(fieldName, file);
        setPreview(URL.createObjectURL(file));
    };


    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Logo */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="logo">Logo</Form.Label>
                            <Form.Control
                                type="file"
                                id="logo"
                                name="logo"
                                className={`form-control`}
                                onChange={(e) => handleFileChange(e, formik.setFieldValue, "logo", setPreviewLogo)}
                                onBlur={formik.handleBlur}
                            />
                            {PreviewLogo ? (
                                <img src={PreviewLogo} alt="Logo Preview" className="mt-2" style={{ maxWidth: "100px" }} />
                            ) : property?.logo === "image.png" ? (
                                <img src={ALLImages('face1')} alt="logo" width={53} className="mt-2" />
                            ) : (
                                <img src={`${import.meta.env.VITE_API_URL}${property?.logo}`} alt="Logo Preview" className="mt-2" style={{ maxWidth: "100px" }} />
                            )}
                        </Form.Group>
                    </Col>
                    {/* Featured Image */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="featured_image">Featured Image</Form.Label>
                            <Form.Control
                                type="file"
                                id="featured_image"
                                name="featured_image"
                                className={`form-control`}
                                onChange={(e) => handleFileChange(e, formik.setFieldValue, "featured_image", setPreviewFeaturedImage)}
                                onBlur={formik.handleBlur}
                            />
                            {PreviewFeaturedImage ? (
                                <img src={PreviewFeaturedImage} alt="Featured Image Preview" className="mt-2" style={{ maxWidth: "100px" }} />
                            ) : property?.featured_image === "image.png" ? (
                                <img src={ALLImages('face1')} alt="logo" width={150} className="mt-2" />
                            ) : (
                                <img src={`${import.meta.env.VITE_API_URL}${property?.featured_image}`} alt="Logo Preview" className="mt-2" style={{ maxWidth: "100px" }} />
                            )}
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Update</Button>
            </Form>
        </Fragment>
    );
}

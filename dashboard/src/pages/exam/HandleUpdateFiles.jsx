import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import ALLImages from "../../common/Imagesdata";
import LoadingBar from 'react-top-loading-bar';

export default function HandleUpdateFiles() {
    const navigate = useNavigate();
    const { Id } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [PreviewLogo, setPreviewLogo] = useState(null);
    const [PreviewFeaturedImage, setPreviewFeaturedImage] = useState(null);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getExam = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get(`/exam/${Id}`);
                setExam(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load exam');
                setLoading(false);
                toast.error('Error fetching exam' + error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getExam();
    }, [Id]);

    const initialValues = {
        logo: exam?.logo || "",
        featured_image: exam?.featured_image || "",
    }

    const handleSubmit = async (values) => {
        try {
            startLoadingBar();
            if (typeof values.logo == 'object' || typeof values.featured_image == 'object' || typeof values.logo != 'object' && values.featured_image != 'object') {
                let formData = new FormData();
                for (let value in values) {
                    formData.append(value, values[value]);
                }
                const response = await API.put(`/update-files/${Id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate('/dashboard/exam');
                }
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
        } finally {
            stopLoadingBar();
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
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">Update Images</h3>
                    <div className="card-options ms-auto">
                        <Link to={"/dashboard/exam"}>
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
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
                                    ) : exam?.logo === "image.png" ? (
                                        <img src={ALLImages('face1')} alt="logo" width={53} className="mt-2" />
                                    ) : (
                                        <img src={`${import.meta.env.VITE_API_URL}${exam?.logo}`} alt="Logo Preview" className="mt-2" style={{ maxWidth: "100px" }} />
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
                                    ) : exam?.featured_image === "image.png" ? (
                                        <img src={ALLImages('face1')} alt="logo" width={250} className="mt-2 h-24" />
                                    ) : (
                                        <img src={`${import.meta.env.VITE_API_URL}${exam?.featured_image}`} alt="Logo Preview" className="mt-2" style={{ maxWidth: "100px" }} />
                                    )}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    );
}

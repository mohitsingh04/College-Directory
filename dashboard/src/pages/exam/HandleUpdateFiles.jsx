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
    const { objectId } = useParams();
    const [exam, setExam] = useState(null);
    const [PreviewLogo, setPreviewLogo] = useState(null);
    const [PreviewFeaturedImage, setPreviewFeaturedImage] = useState(null);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getExam = async () => {
            startLoadingBar();
            try {
                const { data } = await API.get(`/exam/${objectId}`);
                setExam(data);
            } catch (error) {
                toast.error('Error fetching exam' + error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getExam();
    }, [objectId]);

    const initialValues = {
        logo: exam?.logo || "",
        featured_image: exam?.featured_image || "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        startLoadingBar();
        try {
            const formData = new FormData();
            formData.append("logo", values.logo);
            formData.append("featured_image", values.featured_image);

            const response = await API.put(`/update-files/${objectId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message || "Updated successfully", { id: toastId });
            navigate('/dashboard/exam');
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
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
                                    <div className="flex justify-content-between">
                                        <p><strong>Logo</strong></p>
                                    </div>
                                    <Form.Control
                                        type="file"
                                        id="logo"
                                        name="logo"
                                        hidden
                                        accept="image/png, image/jpeg"
                                        className={`form-control`}
                                        onChange={(e) => handleFileChange(e, formik.setFieldValue, "logo", setPreviewLogo)}
                                        onBlur={formik.handleBlur}
                                    />
                                    <div className="mb-3">
                                        {PreviewLogo ? (
                                            <img src={PreviewLogo} alt="Logo Preview" className="w-32 logo-ratio" />
                                        ) : exam?.logo !== "image.png" ? (
                                            <img src={`${import.meta.env.VITE_API_URL}${exam?.logo}`} alt="Logo Preview" className="w-32 logo-ratio" />
                                        ) : (
                                            <img src={ALLImages('noImage')} alt="logo" className="w-32 logo-ratio" />
                                        )}
                                    </div>
                                    <Form.Label htmlFor="logo" className="btn btn-primary btn-sm"><i className="fe fe-upload me-1"></i>Upload Logo</Form.Label>
                                </Form.Group>
                            </Col>
                            {/* Featured Image */}
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <div className="flex justify-content-between">
                                        <p><strong>Featured Image</strong></p>
                                    </div>
                                    <Form.Control
                                        type="file"
                                        id="featured_image"
                                        name="featured_image"
                                        className={`form-control`}
                                        hidden
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => handleFileChange(e, formik.setFieldValue, "featured_image", setPreviewFeaturedImage)}
                                        onBlur={formik.handleBlur}
                                    />
                                    <div className="mb-3">
                                        {PreviewFeaturedImage ? (
                                            <img src={PreviewFeaturedImage} alt="Featured Image Preview" className="shadow-sm banner-ratio" />
                                        ) : exam?.featured_image !== "image.png" ? (
                                            <img src={`${import.meta.env.VITE_API_URL}${exam?.featured_image}`} alt="Featured Image Preview" className="shadow-sm banner-ratio" />
                                        ) : (
                                            <img src={ALLImages('noImage')} alt="logo" width={150} height={50} className="shadow-sm banner-ratio" />
                                        )}
                                    </div>
                                    <Form.Label htmlFor="featured_image" className="btn btn-primary btn-sm"><i className="fe fe-upload me-1"></i>Upload Image</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    );
}

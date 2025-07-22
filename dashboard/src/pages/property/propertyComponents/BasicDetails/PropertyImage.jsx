import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import ALLImages from "../../../../common/Imagesdata";
import { API } from "../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function PropertyImage() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [property, setProperty] = useState(null);
    const [PreviewLogo, setPreviewLogo] = useState(null);
    const [PreviewFeaturedImage, setPreviewFeaturedImage] = useState(null);

    useEffect(() => {
        const getProperty = async () => {
            try {
                const { data } = await API.get(`/property/${uniqueId}`);
                setProperty(data);
            } catch (error) {
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
        const toastId = toast.loading("Updating...");
        try {
            const formData = new FormData();
            formData.append("logo", values.logo);
            formData.append("featured_image", values.featured_image);

            const response = await API.put(`/property-files/${uniqueId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
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

    if (!property) {
        return <Skeleton height={300} />;
    }

    return (
        <Fragment>
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
                                ) : property?.logo !== "image.png" ? (
                                    <img src={`${import.meta.env.VITE_API_URL}${property?.logo}`} alt="Logo Preview" className="w-32 logo-ratio" />
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
                                ) : property?.featured_image !== "image.png" ? (
                                    <img src={`${import.meta.env.VITE_API_URL}${property?.featured_image}`} alt="Featured Image Preview" className="shadow-sm banner-ratio" />
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
        </Fragment>
    );
}

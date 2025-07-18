import React from 'react'
import { Col, Row, Card, Form, ListGroup, Breadcrumb, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../services/API";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ALLImages from "../../common/Imagesdata";

export default function ProfileImage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [previewProfile, setPreviewProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse] = await Promise.all([
                    API.get("/profile"),
                ]);
                setUser(userResponse?.data?.data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData();
    }, []);

    const initialValues = {
        profile_image: user?.profile_image || "",
    }

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("profile_image", values.profile_image);

        const toastId = toast.loading("Updating...");
        try {
            const response = await API.put(`/update-profile-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
                navigate('/dashboard/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed", { id: toastId });
        } finally {
            stopLoadingBar();
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const handleFileChange = (e, setFieldValue, fieldName, setPreview) => {
        const file = e.currentTarget.files[0];
        setFieldValue(fieldName, file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Row>
                <Col xl={12} md={12} sm={12}>
                    {previewProfile
                        ? <img src={previewProfile} alt="Logo Preview" className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                        : user?.profile_image
                            ? <img src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`} alt="Profile Image Preview" className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                            : <img className="rounded-circle" src={ALLImages('face8')} alt="img" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                    }
                </Col>
                <Col xl={12} md={12} sm={12}>
                    <Form.Group className="mb-3">
                        {/* Hidden file input */}
                        <Form.Control
                            type="file"
                            id="profile_image"
                            name="profile_image"
                            accept="image/jpeg, image/png"
                            hidden
                            onChange={(e) => handleFileChange(e, formik.setFieldValue, "profile_image", setPreviewProfile)}
                            onBlur={formik.handleBlur}
                        />

                        {/* Label as button */}
                        <Form.Label htmlFor="profile_image" className="btn btn-primary btn-sm mt-3">
                            <i className="fe fe-upload me-1"></i>Upload Profile
                        </Form.Label>
                    </Form.Group>
                </Col>
            </Row>
            <hr />

            <Button type='submit' variant='primary' className='float-end'>
                Update
            </Button>
        </Form>
    );
}

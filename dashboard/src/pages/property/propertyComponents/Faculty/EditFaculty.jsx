import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import ALLImages from "../../../../common/Imagesdata";

export default function EditFaculty({ facultyUniqueId }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [previewProfile, setPreviewProfile] = useState("");
    const [faculty, setFaculty] = useState("");

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await API.get(`/faculty/${facultyUniqueId}`);
                setFaculty(response.data);
            } catch (error) {
                console.error('Error fetching faculty:', error);
            }
        };

        fetchFaculty();
    }, [facultyUniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        name: faculty[0]?.name || "",
        designation: faculty[0]?.designation || "",
        department: faculty[0]?.department || "",
        profile: faculty[0]?.profile || null,
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required."),
        designation: Yup.string().required("Designation is required."),
        department: Yup.string().required("Department is required."),
    });

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("propertyId", uniqueId);
        formData.append("name", values.name);
        formData.append("designation", values.designation);
        formData.append("department", values.department);
        formData.append("profile", values.profile);

        try {
            const response = await API.put(`/faculty/${facultyUniqueId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

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

    const handleFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("profile", file);
            setPreviewProfile(URL.createObjectURL(file));
        }
    };

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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
                    {/* Designation */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="designation">Designation</Form.Label>
                            <Form.Control
                                type="text"
                                id="designation"
                                placeholder="Designation"
                                name="designation"
                                className={`form-control ${formik.touched.designation && formik.errors.designation ? 'is-invalid' : ''}`}
                                value={formik.values.designation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.designation && formik.errors.designation ? (
                                <div className="text-danger">
                                    {formik.errors.designation}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Department */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="department">Department</Form.Label>
                            <Form.Control
                                type="text"
                                id="department"
                                placeholder="Department"
                                name="department"
                                className={`form-control ${formik.touched.department && formik.errors.department ? 'is-invalid' : ''}`}
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.department && formik.errors.department ? (
                                <div className="text-danger">
                                    {formik.errors.department}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Profile */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="profile">Profile</Form.Label>
                            <Form.Control
                                type="file"
                                id="profile"
                                name="profile"
                                className={`form-control`}
                                onChange={handleFileChange}
                                onBlur={formik.handleBlur}
                            />
                            {previewProfile
                                ?
                                <img src={previewProfile} width={80} height={80} className="mt-1" alt="" />
                                : faculty[0]?.profile !== "image.png"
                                    ?
                                    <img src={`${import.meta.env.VITE_API_URL}${faculty[0]?.profile}`} width={80} height={80} className="mt-1" alt="" />
                                    : <img src={ALLImages('avatar')} alt="profile" width={53} className="Profile" />
                            }
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Update</Button>
            </Form>
        </Fragment>
    );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../services/API";
import Dropdown from "react-dropdown-select";
import PhoneInput from "react-phone-input-2";

export default function College() {
    const navigate = useNavigate();
    const [property, setProperty] = useState([]);

    useEffect(() => {
        try {
            const getProperty = async () => {
                const response = await API.get(`/property`);
                setProperty(response.data);
            };
        } catch (error) {

        }

        getProperty();
    }, []);

    const initialValues = {
        property_type: "College",
        college_or_university_type: "",
        property_name: "",
        short_name: "",
        phone_number: "",
        email: "",
        affiliated_by: "",
        established_year: "",
    };

    const validationSchema = Yup.object({
        property_name: Yup.string().required("College name is required."),
        short_name: Yup.string().required("Short name is required."),
        phone_number: Yup.string().required("Phone is required."),
        email: Yup.string().required("Email address is required."),
    });

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post("/property", values);

            toast.success(response.data.message || "Added successfully", { id: toastId });
            navigate(`/dashboard/property/view/${response.data.savedProperty.uniqueId}?tab=info`);
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const CollegeOrUniversityTypeData = [
        { value: "Private", label: "Private College" },
        { value: "Government", label: "Government College" },
        { value: "Semi Government", label: "Semi Government College" },
    ];

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <Row>
                    {/* Property Name */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="property_name">College Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="property_name"
                                placeholder="College Name"
                                name="property_name"
                                className={`form-control ${formik.touched.property_name && formik.errors.property_name ? 'is-invalid' : ''}`}
                                value={formik.values.property_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.property_name && formik.errors.property_name ? (
                                <div className="text-danger">
                                    {formik.errors.property_name}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Short Name */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="short_name">Short Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="short_name"
                                placeholder="Short Name"
                                name="short_name"
                                className={`form-control ${formik.touched.short_name && formik.errors.short_name ? 'is-invalid' : ''}`}
                                value={formik.values.short_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.short_name && formik.errors.short_name ? (
                                <div className="text-danger">
                                    {formik.errors.short_name}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Phone Number */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="phone_number">Phone Number</Form.Label>
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
                    {/* Affiliated By */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="affiliated_by">Affiliated By</Form.Label>
                            <Dropdown
                                options={property
                                    .filter((item) => item.property_type === "University")
                                    .map((group) => ({
                                        label: group.property_name,
                                        value: group.property_name,
                                    }))}
                                values={[]}
                                closeOnSelect={false}
                                placeholder="Choose Affiliation  "
                                multi={true}
                                keepSelectedInList={false}
                                searchable={false}
                                dropdownHandle={false}
                                value={formik.values.affiliated_by}
                                onChange={(value) => formik.setFieldValue("affiliated_by", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* College Type */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="college_or_university_type">College Type</Form.Label>
                            <Dropdown
                                options={CollegeOrUniversityTypeData}
                                values={[]}
                                closeOnSelect={false}
                                placeholder="Choose College Type    "
                                multi={false}
                                keepSelectedInList={false}
                                searchable={false}
                                dropdownHandle={false}
                                value={formik.values.college_or_university_type}
                                onChange={(value) => formik.setFieldValue("college_or_university_type", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Established Year */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="established_year">Established Year</Form.Label>
                            <Form.Control
                                type="text"
                                id="established_year"
                                placeholder="Established Year"
                                name="established_year"
                                className={`form-control`}
                                value={formik.values.established_year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Adding..." : "Add"}
                </Button>
            </Form>
        </div>
    );
}

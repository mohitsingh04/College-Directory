import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import Dropdown from "react-dropdown-select";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import PhoneInput from "react-phone-input-2";
import Skeleton from "react-loading-skeleton";

export default function EditBasicDetails({ onUpdated }) {
    const { uniqueId } = useParams();
    const [property, setProperty] = useState(null);
    const [propertyData, setPropertyData] = useState([]);
    const [status, setStatus] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, propertyRes, statusRes, propertyDataRes] = await Promise.all([
                    API.get("/profile"),
                    API.get(`/property/${uniqueId}`),
                    API.get("/status"),
                    API.get("/property"),
                ]);

                setAuthUser(profileRes?.data?.data);
                setProperty(propertyRes?.data);
                setStatus(statusRes?.data?.filter(item => item.parent_status === "Category"));
                setPropertyData(propertyDataRes?.data);
            } catch (error) {
                toast.error(error.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uniqueId]);

    const validationSchema = Yup.object({
        property_name: Yup.string().required("University name is required."),
        short_name: Yup.string().required("Short name is required."),
        phone_number: Yup.string().required("Phone number is required."),
        email: Yup.string().required("Email address is required."),
        status: Yup.string().required("Status is required."),
    });

    const formik = useFormik({
        initialValues: {
            property_name: property?.property_name || "",
            short_name: property?.short_name || "",
            phone_number: property?.phone_number || "",
            alt_phone_number: property?.alt_phone_number || "",
            email: property?.email || "",
            affiliated_by: property?.affiliated_by || [],
            established_year: property?.established_year || "",
            college_or_university_type: property?.college_or_university_type || [],
            status: property?.status || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const toastId = toast.loading("Updating...");
            try {
                const response = await API.put(`/property/${uniqueId}`, values);
                toast.success(response.data.message || "Updated successfully", { id: toastId });
                onUpdated(values);
            } catch (error) {
                toast.error(error.response?.data?.error || "Update failed", { id: toastId });
            }
        },
        enableReinitialize: true
    });

    const AffiliationData = [
        { value: "AICTE", label: "All India Council for Technical Education(AICTE)" },
        { value: "BCI", label: "Bar Council of India(BCI)" },
        { value: "UGC", label: "University Grants Commission(UGC)" },
    ];

    const UniversityTypeData = [
        { value: "Private", label: "Private University" },
        { value: "Government", label: "Government University" },
        { value: "Semi Government", label: "Semi Government University" },
        { value: "Deemed", label: "Deemed University" },
    ];

    const CollegeTypeData = [
        { value: "Private", label: "Private College" },
        { value: "Government", label: "Government College" },
        { value: "Semi Government", label: "Semi Government College" },
    ];

    if (loading || !property) {
        return (
            <Skeleton height={300} />
        );
    }

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Row>
                {/* Full Name */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="property_name"
                            placeholder="University Name"
                            value={formik.values.property_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.property_name && formik.errors.property_name ? 'is-invalid' : ''}`}
                        />
                        {formik.touched.property_name && formik.errors.property_name && (
                            <div className="text-danger">{formik.errors.property_name}</div>
                        )}
                    </Form.Group>
                </Col>

                {/* Short Name */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="short_name"
                            placeholder="Short Name"
                            value={formik.values.short_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.short_name && formik.errors.short_name ? 'is-invalid' : ''}`}
                        />
                        {formik.touched.short_name && formik.errors.short_name && (
                            <div className="text-danger">{formik.errors.short_name}</div>
                        )}
                    </Form.Group>
                </Col>

                {/* Phone Number */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        {/* <PhoneInput
                            country={'in'}
                            value={formik.values.phone_number}
                            onChange={(value) => formik.setFieldValue("phone_number", value)}
                            onBlur={formik.handleBlur("phone_number")}
                            inputClass={`border w-100 ${formik.touched.phone_number && formik.errors.phone_number ? "border-danger" : ""}`}
                            inputStyle={{ height: "45px" }}
                            buttonClass={`bg-white border ${formik.touched.phone_number && formik.errors.phone_number ? "border-danger" : ""}`}
                        /> */}
                        <Form.Control
                            type="text"
                            id="phone_number"
                            placeholder="Phone number/Landline number"
                            name="phone_number"
                            className={`form-control ${formik.touched.phone_number && formik.errors.phone_number ? 'is-invalid' : ''}`}
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.phone_number && formik.errors.phone_number && (
                            <div className="text-danger">{formik.errors.phone_number}</div>
                        )}
                    </Form.Group>
                </Col>

                {/* Alternate Phone */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        {/* <PhoneInput
                            country={'in'}
                            value={formik.values.alt_phone_number}
                            onChange={(value) => formik.setFieldValue("alt_phone_number", value)}
                            onBlur={formik.handleBlur("alt_phone_number")}
                            inputClass="border w-100"
                            inputStyle={{ height: "45px" }}
                        /> */}
                        <Form.Control
                            type="text"
                            id="alt_phone_number"
                            placeholder="Phone number/Landline number"
                            name="alt_phone_number"
                            className={`form-control ${formik.touched.alt_phone_number && formik.errors.alt_phone_number ? 'is-invalid' : ''}`}
                            value={formik.values.alt_phone_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Col>

                {/* Email */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">{formik.errors.email}</div>
                        )}
                    </Form.Group>
                </Col>

                {/* Established Year */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        {/* <Form.Label htmlFor="established_year">Established Year</Form.Label> */}
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
                {/* Affiliated By */}
                <Col md={6}>
                    <Form.Group className="mb-3">
                        {/* <Form.Label htmlFor="affiliated_by">Affiliated By</Form.Label> */}
                        <Dropdown
                            options={property?.property_type === "College"
                                ? propertyData
                                    .filter((item) => item.property_type === "University")
                                    .map((group) => ({
                                        label: group.property_name,
                                        value: group.property_name,
                                    }))
                                :
                                AffiliationData
                            }
                            closeOnSelect={false}
                            placeholder="Choose Affiliation  "
                            multi={true}
                            keepSelectedInList={false}
                            searchable={false}
                            dropdownHandle={false}
                            values={property?.affiliated_by}
                            value={formik.values.affiliated_by}
                            onChange={(value) => formik.setFieldValue("affiliated_by", value)}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                </Col>
                {/* University Type */}
                {property?.property_type === "University"
                    ?
                    <>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Dropdown
                                    options={UniversityTypeData}
                                    values={formik.values.college_or_university_type}
                                    closeOnSelect={false}
                                    placeholder="Choose University Type    "
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
                    </>
                    :
                    <>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Dropdown
                                    options={CollegeTypeData}
                                    values={formik.values.college_or_university_type}
                                    closeOnSelect={false}
                                    placeholder="Choose University Type    "
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
                    </>
                }

                {/* Status */}
                {authUser?.role === "Super Admin" || authUser?.role === "Admin" ? (
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Select
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Status</option>
                                {status.map((item) => (
                                    <option key={item.uniqueId} value={item.status_name}>
                                        {item.status_name}
                                    </option>
                                ))}
                            </Form.Select>
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-danger">{formik.errors.status}</div>
                            )}
                        </Form.Group>
                    </Col>
                ) : null}
            </Row>

            <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Updating..." : "Update"}
            </Button>
        </Form>
    );
}

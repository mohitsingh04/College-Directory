import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import Dropdown from "react-dropdown-select";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import PhoneInput from "react-phone-input-2";
import Skeleton from "react-loading-skeleton";

export default function EditBasicDetails() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [property, setProperty] = useState("");
    const [propertyData, setPropertyData] = useState([]);
    const [status, setStatus] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchData();
    }, []);

    const initialValues = {
        property_name: property?.property_name || "",
        short_name: property?.short_name || "",
        phone_number: property?.phone_number || "",
        alt_phone_number: property?.alt_phone_number || "",
        email: property?.email || "",
        affiliated_by: property?.affiliated_by || "",
        established_year: property?.established_year || "",
        college_or_university_type: property?.college_or_university_type || "",
        status: property?.status || "",
    }

    const validationSchema = Yup.object({
        property_name: Yup.string().required("University name is required."),
        short_name: Yup.string().required("Short name is required."),
        phone_number: Yup.string().required("Phone number is required."),
        alt_phone_number: Yup.string(),
        email: Yup.string().required("Email address is required."),
        status: Yup.string().required("Status is required."),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.put(`/property/${uniqueId}`, values);

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

    return (
        <Fragment>
            {loading
                ?
                <Skeleton height={300} />
                :
                <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <Row>
                        {/* University Name */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                {/* <Form.Label htmlFor="property_name">University Name</Form.Label> */}
                                <Form.Control
                                    type="text"
                                    id="property_name"
                                    placeholder="University Name"
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
                                {/* <Form.Label htmlFor="short_name">Short Name</Form.Label> */}
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
                                {/* <Form.Label htmlFor="phone_number">Phone Number</Form.Label> */}
                                {/* <Form.Control
                                type="text"
                                id="phone_number"
                                placeholder="Phone Number"
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
                        {/* Alternate Phone Number */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                {/* <Form.Label htmlFor="alt_phone_number">Alternate Phone Number</Form.Label> */}
                                <PhoneInput
                                    country={'in'}
                                    value={formik.values.alt_phone_number}
                                    inputClass={`border w-100 ${formik.touched.alt_phone_number && formik.errors.alt_phone_number ? "border-danger" : ""}`}
                                    inputStyle={{ height: "45px" }}
                                    buttonClass={`bg-white border ${formik.touched.alt_phone_number && formik.errors.alt_phone_number ? "border-danger" : ""}`}
                                    onChange={(value) => formik.setFieldValue("alt_phone_number", value)}
                                    onBlur={formik.handleBlur("alt_phone_number")}
                                />
                                {formik.touched.alt_phone_number && formik.errors.alt_phone_number ? (
                                    <div className="text-danger">
                                        {formik.errors.alt_phone_number}
                                    </div>
                                ) : null}
                            </Form.Group>
                        </Col>
                        {/* Email */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                {/* <Form.Label htmlFor="email">Email</Form.Label> */}
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
                                    <Form.Label htmlFor="status">Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select Status</option>
                                        {status.map((item) => (
                                            <option key={item.uniqueId} value={item.status_name}>{item.status_name}</option>
                                        ))}
                                    </Form.Select>
                                    {formik.errors.status && formik.touched.status ? <div className="text-danger mt-1">{formik.errors.status}</div> : null}
                                </Form.Group>
                            </Col>
                        ) : null}

                    </Row>
                    <Button type="submit">Update</Button>
                </Form>
            }
        </Fragment>
    );
}

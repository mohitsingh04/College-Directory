import React, { Fragment, useEffect, useRef, useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../services/API";
import { useQuery } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";

const fetchData = async () => {
    const { data } = await API.get("/fetch-city");
    return { data };
}

const DownloadBrochure = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["myData"],
        queryFn: fetchData,
    });

    const [cities, setCities] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCitiesData = async () => {
            try {
                const response = await API.get("/fetch-city");
                setCities(response?.data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        const getCoursesData = async () => {
            try {
                const response = await API.get("/course");
                const filteredData = response?.data.filter((course) => course.status === "Active");
                setCourses(filteredData);
            } catch (error) {
                toast.error(error.message);
            }
        };

        getCitiesData();
        getCoursesData();
    }, []);

    const initialValues = {
        full_name: "",
        email: "",
        phone_number: "",
        city: "",
        course: ""
    };

    const validationSchema = Yup.object({
        full_name: Yup.string().required("Name is required."),
        email: Yup.string().required("Email is required."),
        phone_number: Yup.string().required("Phone number is required."),
        city: Yup.string().required("City is required."),
        course: Yup.string().required("Course is required."),
    });

    const handleSubmit = async (values) => {
        try {
            console.log(values)
            // const response = await API.post("/download-brochure", values);
            // if (response.data.message) {
            //     toast.success(response.data.message);
            //     formik.resetForm();
            // } else {
            //     toast.error(response.data.error);
            // }
        } catch (error) {
            toast.error(`Submission failed: ${error.message}`);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="full_name">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="full_name"
                                placeholder="Full Name"
                                name="full_name"
                                className={`form-control ${formik.touched.full_name && formik.errors.full_name
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                value={formik.values.full_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.full_name && formik.errors.full_name ? (
                                <small className="text-danger">
                                    {formik.errors.full_name}
                                </small>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                id="email"
                                placeholder="Email Address"
                                name="email"
                                className={`form-control ${formik.touched.email && formik.errors.email
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <small className="text-danger">
                                    {formik.errors.email}
                                </small>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="phone_number">Phone Number</Form.Label>
                            {/* <Form.Control
                                type="text"
                                id="phone_number"
                                placeholder="Phone Number"
                                name="phone_number"
                                className={`form-control ${formik.touched.phone_number && formik.errors.phone_number
                                    ? "is-invalid"
                                    : ""
                                    }`}
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
                                <small className="text-danger">
                                    {formik.errors.phone_number}
                                </small>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="city">City</Form.Label>
                            <Form.Select
                                id="city"
                                name="city"
                                className={`form-control ${formik.touched.city && formik.errors.city ? "is-invalid" : ""}`}
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select City</option>
                                {isLoading
                                    ? <h1>Loading...</h1>
                                    :
                                    <>
                                        {data?.data.map((items) => (
                                            <option key={items.id} value={items.name}>{items.name}</option>
                                        ))}
                                    </>
                                }
                            </Form.Select>
                            {formik.touched.city && formik.errors.city ? (
                                <small className="text-danger">
                                    {formik.errors.city}
                                </small>
                            ) : null}
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="course">Course</Form.Label>
                            <Form.Select
                                id="course"
                                name="course"
                                className={`form-control ${formik.touched.course && formik.errors.course ? "is-invalid" : ""}`}
                                value={formik.values.course}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Select Course</option>
                                {courses.map((items) => (
                                    <option key={items.id} value={items.name}>({items.short_name}) - {items.name}</option>
                                ))}
                            </Form.Select>
                            {formik.touched.course && formik.errors.course ? (
                                <small className="text-danger">
                                    {formik.errors.course}
                                </small>
                            ) : null}
                        </Form.Group>
                    </Col>
                </Row>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">
                    Submit
                </button>
            </Form>
        </Fragment>
    );
};

export default DownloadBrochure;

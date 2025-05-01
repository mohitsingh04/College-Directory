import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import Dropdown from "react-dropdown-select";
import JoditEditor from "jodit-react";

export default function AddSeo() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [propertyData, setPropertyData] = useState("");
    const [count, setCount] = useState(0);
    const maxChars = 200;

    const fetchPropertyData = async () => {
        const response = await API.get(`/property/${uniqueId}`);
        setPropertyData(response.data);
    };

    useEffect(() => {
        fetchPropertyData();
    }, [uniqueId]);

    const slugify = (text) => text?.toLowerCase()?.replace(/\s+/g, "-")?.replace(/[^\w\-]+/g, "");

    const seo_slug = slugify(propertyData?.property_name?.toLowerCase());

    const initialValues = {
        propertyId: uniqueId,
        title: propertyData?.property_name || "",
        slug: seo_slug || "",
        meta_tags: "",
        primary_focus_keywords: "",
        json_schema: "",
        description: "",
    }

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required."),
        slug: Yup.string().required("Slug is required."),
        json_schema: Yup.string().required("Json schema is required.")
            .max(maxChars, `Json Schema must not exceed ${maxChars} characters`),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.post(`/seo`, values);

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

    useEffect(() => {
        setCount(formik.values.json_schema.length);
    }, [formik.values.json_schema]);

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submission
                }
            }}>
                <Row>
                    {/* Title */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="title">Title</Form.Label>
                            <Form.Control
                                type="text"
                                id="title"
                                placeholder="Seo title"
                                name="title"
                                className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
                            />
                            {formik.touched.title && formik.errors.title ? (
                                <div className="text-danger">
                                    {formik.errors.title}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Slug */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="slug">Slug</Form.Label>
                            <Form.Control
                                type="text"
                                id="slug"
                                placeholder="Slug"
                                name="slug"
                                className={`form-control ${formik.touched.slug && formik.errors.slug ? 'is-invalid' : ''}`}
                                value={formik.values.slug}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
                            />
                            {formik.touched.slug && formik.errors.slug ? (
                                <div className="text-danger">
                                    {formik.errors.slug}
                                </div>
                            ) : null}
                        </Form.Group>
                    </Col>
                    {/* Meta Tags */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="meta_tags">Meta Tags</Form.Label>
                            <Dropdown
                                options={[]}
                                values={[]}
                                create={true}
                                placeholder="Meta Tags...    "
                                searchable={true}
                                dropdownHandle={false}
                                multi={true}
                                value={formik.values.meta_tags}
                                onChange={(value) => formik.setFieldValue("meta_tags", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Primary focus keyword */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="primary_foucus_keyword">Primary focus keyword</Form.Label>
                            <Dropdown
                                options={[]}
                                values={[]}
                                create={true}
                                placeholder="Primary focus keyword...    "
                                searchable={true}
                                dropdownHandle={false}
                                multi={true}
                                value={formik.values.primary_focus_keywords}
                                onChange={(value) => formik.setFieldValue("primary_focus_keywords", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Json Schema */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="json_schema">Json Schema</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="json_schema"
                                placeholder="Json Schema"
                                name="json_schema"
                                className={`form-control ${formik.touched.json_schema && formik.errors.json_schema ? 'is-invalid' : ''}`}
                                value={formik.values.json_schema}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.json_schema && formik.errors.json_schema ? (
                                <div className="text-danger">
                                    {formik.errors.json_schema}
                                </div>
                            ) : null}
                            <p className="text-end">{count}/{maxChars}</p>
                        </Form.Group>
                    </Col>
                    {/* Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.description}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("description", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}

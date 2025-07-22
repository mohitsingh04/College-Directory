import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import { getEditorConfig } from "../../../../services/context/editorConfig";

export default function EditFaqs({ faqsUniqueId, onFaqUpdated }) {
    const { uniqueId } = useParams();
    const [faqs, setFaqs] = useState("");
    const [loading, setLoading] = useState(true);
    const editorConfig = useMemo(() => getEditorConfig(), []);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/faqs/${faqsUniqueId}`);
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching faqs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, [faqsUniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        question: faqs?.question || "",
        answer: faqs?.answer || "",
    };

    const validationSchema = Yup.object({
        question: Yup.string().required("Question is required."),
        answer: Yup.string().required("Answer is required."),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.put(`/faqs/${faqsUniqueId}`, values);

            if (response.status === 200) {
                toast.success(response.data.message);
                if (onFaqUpdated) onFaqUpdated();
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
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={300} />
            ) : (
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="question">Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="question"
                                    placeholder="Question"
                                    name="question"
                                    className={`form-control ${formik.touched.question && formik.errors.question ? 'is-invalid' : ''}`}
                                    value={formik.values.question}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.question && formik.errors.question && (
                                    <div className="text-danger">{formik.errors.question}</div>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Answer</Form.Label>
                                <JoditEditor
                                    config={editorConfig}
                                    value={formik.values.answer}
                                    onBlur={(newContent) => formik.setFieldValue("answer", newContent)}
                                />
                                {formik.touched.answer && formik.errors.answer && (
                                    <div className="text-danger">{formik.errors.answer}</div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </Form>
            )}
        </Fragment>
    );
}

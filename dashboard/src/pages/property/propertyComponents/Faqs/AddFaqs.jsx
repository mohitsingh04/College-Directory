import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

export default function AddFaqs({ onFaqAdded }) {
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        question: "",
        answer: "",
    };

    const validationSchema = Yup.object({
        question: Yup.string().required("Question is required."),
        answer: Yup.string().required("Answer is required."),
    });

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post(`/faqs`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                if (onFaqAdded) onFaqAdded();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Fragment>
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
                                config={{ height: 300 }}
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
                    {formik.isSubmitting ? "Adding..." : "Add"}
                </Button>
            </Form>
        </Fragment>
    );
}

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditQuestionAndAnswer({ questionAndAnswerUniqueId, onQnaUpdated }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [questionAndAnswer, setQuestionAndAnswer] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestionAndAnswer = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/questionAndAnswer/${questionAndAnswerUniqueId}`);
                setQuestionAndAnswer(response.data);
            } catch (error) {
                console.error('Error fetching questionAndAnswer:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionAndAnswer();
    }, [questionAndAnswerUniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        question: questionAndAnswer?.question || "",
        answer: questionAndAnswer?.answer || "",
    }

    const validationSchema = Yup.object({
        question: Yup.string().required("Question is required."),
        answer: Yup.string().required("Answer is required.")
    });

    const handleSubmit = async (values) => {
            const toastId = toast.loading("Updating...");
        try {
            const response = await API.put(`/questionAndAnswer/${questionAndAnswerUniqueId}`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
                onQnaUpdated();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    return (
        <Fragment>
            {loading
                ?
                <Skeleton height={300} />
                :
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        {/* Question */}
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
                                {formik.touched.question && formik.errors.question ? (
                                    <div className="text-danger">
                                        {formik.errors.question}
                                    </div>
                                ) : null}
                            </Form.Group>
                        </Col>
                        {/* Answer */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Answer</Form.Label>
                                <JoditEditor
                                    config={{
                                        height: 300,
                                    }}
                                    value={formik.values.answer}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("answer", newContent)
                                    }
                                />
                                {formik.touched.answer && formik.errors.answer ? (
                                    <div className="text-danger">
                                        {formik.errors.answer}
                                    </div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Updating..." : "Update"}
                    </Button>
                </Form>
            }
        </Fragment>
    );
}

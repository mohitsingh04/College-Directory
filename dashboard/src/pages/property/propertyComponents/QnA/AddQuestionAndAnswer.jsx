import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";

export default function AddQnA() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const editorRef = useRef(null);
    const [answer, setAnswer] = useState("");

    const initialValues = {
        propertyId: uniqueId,
        question: "",
    }

    const validationSchema = Yup.object({
        question: Yup.string().required("Question is required."),
    });

    const handleSubmit = async (values) => {
        try {
            values = { ...values, answer: editorRef.current.getContent() }
            const response = await API.post(`/questionAndAnswer`, values);

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
    });

    return (
        <Fragment>
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
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => editorRef.current = editor}
                                onChange={(e) => setAnswer(editorRef.current.getContent())}
                                onBlur={formik.handleBlur}
                                init={{
                                    height: 250,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}

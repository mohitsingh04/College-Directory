import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";

export default function AddOtherBasicInformation() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const shortDescriptionRef = useRef(null);
    const fullDescriptionRef = useRef(null);
    const admissionProcessRef = useRef(null);
    const loanProcessRef = useRef(null);
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");
    const [admissionProcess, setAdmissionProcess] = useState("");
    const [loanProcess, setLoanProcess] = useState("");

    const initialValues = {
        propertyId: uniqueId,
        youtube_link: "",
        bitly_link: "",
        website_url: "",
        brochure: null,
        hindi_podcast: null,
        english_podcast: null,
        short_description: "",
        full_description: "",
        admission_process: "",
        loan_process: "",
    }

    const handleSubmit = async (values) => {
        try {
            values.short_description = shortDescriptionRef.current.getContent();
            values.full_description = fullDescriptionRef.current.getContent();
            values.admission_process = admissionProcessRef.current.getContent();
            values.loan_process = loanProcessRef.current.getContent();

            const formData = new FormData();
            formData.append("propertyId", uniqueId);
            formData.append("youtube_link", values.youtube_link);
            formData.append("bitly_link", values.bitly_link);
            formData.append("website_url", values.website_url);
            formData.append("brochure", values.brochure);
            formData.append("hindi_podcast", values.hindi_podcast);
            formData.append("english_podcast", values.english_podcast);
            formData.append("short_description", values.short_description);
            formData.append("full_description", values.full_description);
            formData.append("admission_process", values.admission_process);
            formData.append("loan_process", values.loan_process);

            const response = await API.post(`/otherBasicDetails`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
            }
            window.location.reload();
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
        onSubmit: handleSubmit,
    });

    const handleBrochureFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("brochure", file);
        }
    };

    const handleHindiPodcastFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("hindi_podcast", file);
        }
    };

    const handleEnglishPodcastFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("english_podcast", file);
        }
    };

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <Row>
                    {/* Youtube Link */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="youtube_link">Youtube Link</Form.Label>
                            <Form.Control
                                type="text"
                                id="youtube_link"
                                placeholder="Youtube Link"
                                name="youtube_link"
                                className={`form-control`}
                                value={formik.values.youtube_link}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Bitly Link */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="bitly_link">Bitly Link</Form.Label>
                            <Form.Control
                                type="text"
                                id="bitly_link"
                                placeholder="Bitly Link"
                                name="bitly_link"
                                className={`form-control`}
                                value={formik.values.bitly_link}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Website Url */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="website_url">Website Url</Form.Label>
                            <Form.Control
                                type="text"
                                id="website_url"
                                placeholder="Website Url"
                                name="website_url"
                                className={`form-control`}
                                value={formik.values.website_url}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Brochure */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="brochure">Brochure <span style={{ fontSize: "10px" }}>(pdf)</span></Form.Label>
                            <Form.Control
                                type="file"
                                id="brochure"
                                name="brochure"
                                accept="application/pdf"
                                className={`form-control`}
                                onChange={handleBrochureFileChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Hindi Podcast */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="hindi_podcast">Hindi Podcast <span style={{ fontSize: "10px" }}>(mp3)</span></Form.Label>
                            <Form.Control
                                type="file"
                                id="hindi_podcast"
                                name="hindi_podcast"
                                className={`form-control`}
                                accept="audio/mp3,audio/*;capture=microphone"
                                onChange={handleHindiPodcastFileChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* English Podcast */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="english_podcast">English Podcast <span style={{ fontSize: "10px" }}>(mp3)</span></Form.Label>
                            <Form.Control
                                type="file"
                                id="english_podcast"
                                name="english_podcast"
                                className={`form-control`}
                                accept="audio/mp3,audio/*;capture=microphone"
                                onChange={handleEnglishPodcastFileChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Short Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                onChange={(e) => setShortDescription(shortDescriptionRef.current.getContent())}
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
                    {/* Full Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Description</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => fullDescriptionRef.current = editor}
                                onChange={(e) => setFullDescription(fullDescriptionRef.current.getContent())}
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
                    {/* Admission Process */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Admission Process</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => admissionProcessRef.current = editor}
                                onChange={(e) => setAdmissionProcess(admissionProcessRef.current.getContent())}
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
                    {/* Loan Process */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Loan Process</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => loanProcessRef.current = editor}
                                onChange={(e) => setLoanProcess(loanProcessRef.current.getContent())}
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

import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import { getEditorConfig } from "../../../../services/context/editorConfig";

export default function EditOtherBasicInformation() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [otherBasicInformation, setOtherBasicInformation] = useState([]);
    const [loading, setLoading] = useState(true);
    const editorConfig = useMemo(() => getEditorConfig(), []);

    useEffect(() => {
        const fetchOtherBasicInformation = async () => {
            try {
                const response = await API.get(`/other-basic-details-property/${uniqueId}`);
                setOtherBasicInformation(response?.data);
            } catch (error) {
                console.error('Error fetching other basic information:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOtherBasicInformation();
    }, [uniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        youtube_link: otherBasicInformation?.youtube_link || "",
        bitly_link: otherBasicInformation?.bitly_link || "",
        website_url: otherBasicInformation?.website_url || "",
        brochure: otherBasicInformation?.brochure || null,
        hindi_podcast: otherBasicInformation?.hindi_podcast || null,
        english_podcast: otherBasicInformation?.english_podcast || null,
        short_description: otherBasicInformation?.short_description || "",
        full_description: otherBasicInformation?.full_description || "",
        admission_process: otherBasicInformation?.admission_process || "",
        loan_process: otherBasicInformation?.loan_process || "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
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

            const response = await API.put(`/otherBasicDetails/${otherBasicInformation?.uniqueId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
                navigate(0);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed", { id: toastId });
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        enableReinitialize: true
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

    if (loading || !otherBasicInformation) {
        return (
            <Skeleton height={300} />
        );
    }

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
                            {otherBasicInformation?.brochure !== "brochure.pdf" ? (
                                <u>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.brochure}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Brochure
                                    </a>
                                </u>
                            ) : (
                                null
                            )}
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
                            {otherBasicInformation?.hindi_podcast !== "music.mp3" ? (
                                <u>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.hindi_podcast}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Podcast
                                    </a>
                                </u>
                            ) : (
                                null
                            )}
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
                            {otherBasicInformation?.english_podcast !== "music.mp3" ? (
                                <u>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.english_podcast}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Podcast
                                    </a>
                                </u>
                            ) : (
                                null
                            )}
                        </Form.Group>
                    </Col>
                    {/* Short Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <JoditEditor
                                config={editorConfig}
                                value={formik.values.short_description}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("short_description", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>
                    {/* Full Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Description</Form.Label>
                            <JoditEditor
                                config={editorConfig}
                                value={formik.values.full_description}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("full_description", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Updating..." : "Update"}
                </Button>
            </Form>
        </Fragment>
    );
}

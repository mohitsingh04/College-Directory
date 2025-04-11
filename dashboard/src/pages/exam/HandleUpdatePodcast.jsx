import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import * as Yup from "yup";
import LoadingBar from 'react-top-loading-bar';

export default function HandleUpdatePodcast() {
    const navigate = useNavigate();
    const { Id } = useParams();
    const [exam, setExam] = useState(null);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getExam = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get(`/exam/${Id}`);
                setExam(data);
            } catch (error) {
                toast.error('Error fetching exam' + error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getExam();
    }, [Id]);

    const initialValues = {
        podcast_hindi: exam?.podcast_hindi || null,
        podcast_english: exam?.podcast_english || null,
    }

    const validationSchema = Yup.object({
        podcast_hindi: Yup.string().required("File is required."),
        podcast_english: Yup.string().required("File is required."),
    });

    const handleSubmit = async (values) => {
        try {
            startLoadingBar();
            const formData = new FormData();
            formData.append("podcast_hindi", values.podcast_hindi);
            formData.append("podcast_english", values.podcast_english);

            const response = await API.put(`/update-files/${Id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/dashboard/exam');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 404) {
                    toast.error(error.response.data.error || "Not Found");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error, please try again later.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } else {
                toast.error(`Failed: ${error.message}`);
            }
        } finally {
            stopLoadingBar();
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const handleHindiPodcastFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("podcast_hindi", file);
        }
    };

    const handleEnglishPodcastFileChange = (e) => {
        if (e.currentTarget.files.length > 0) {
            const file = e.currentTarget.files[0];
            formik.setFieldValue("podcast_english", file);
        }
    };

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">Update Podcast</h3>
                    <div className="card-options ms-auto">
                        <Link to={"/dashboard/exam"}>
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            {/* Hindi Podcast */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="podcast_hindi">Hindi Podcast <span style={{ fontSize: "10px" }}>(mp3)</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        id="podcast_hindi"
                                        name="podcast_hindi"
                                        className={`form-control`}
                                        accept="audio/mp3,audio/*;capture=microphone"
                                        onChange={handleHindiPodcastFileChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.podcast_hindi && formik.touched.podcast_hindi ? <div className="text-danger mt-1">{formik.errors.podcast_hindi}</div> : null}
                                    {exam?.podcast_hindi ? (
                                        <div className="mt-1">
                                            {/* <a
                                                href={`${import.meta.env.VITE_API_URL}${exam?.podcast_hindi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Podcast
                                            </a> */}
                                            <audio controls>
                                                <source src={`${import.meta.env.VITE_API_URL}${exam?.podcast_hindi}`} type="audio/mpeg" />
                                                Listen Hindi Podcast.
                                            </audio>
                                        </div>
                                    ) : (
                                        null
                                    )}
                                </Form.Group>
                            </Col>
                            {/* English Podcast */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="podcast_english">English Podcast <span style={{ fontSize: "10px" }}>(mp3)</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        id="podcast_english"
                                        name="podcast_english"
                                        className={`form-control`}
                                        accept="audio/mp3,audio/*;capture=microphone"
                                        onChange={handleEnglishPodcastFileChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.podcast_english && formik.touched.podcast_english ? <div className="text-danger mt-1">{formik.errors.podcast_english}</div> : null}
                                    {exam?.podcast_english ? (
                                        <div className="mt-1">
                                            <audio controls>
                                                <source src={`${import.meta.env.VITE_API_URL}${exam?.podcast_english}`} type="audio/mpeg" />
                                                Listen English Podcast.
                                            </audio>
                                        </div>
                                    ) : (
                                        null
                                    )}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    );
}

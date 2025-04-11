import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";

export default function AddOtherDetails() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const naacRef = useRef(null);
    const nirfRef = useRef(null);
    const nbaRef = useRef(null);
    const ajRankingRef = useRef(null);
    const [naac, setNaac] = useState("");
    const [nirf, setNirf] = useState("");
    const [nba, setNba] = useState("");
    const [ajRanking, setAJRanking] = useState("");

    const initialValues = {
        propertyId: uniqueId,
        bengal_credit_card: null,
        cuet: null,
        naac: "",
        nirf: "",
        nba: "",
        aj_ranking: "",
    }

    const handleSubmit = async (values) => {
        try {
            values.naac = naacRef.current.getContent();
            values.nirf = nirfRef.current.getContent();
            values.nba = nbaRef.current.getContent();
            values.aj_ranking = ajRankingRef.current.getContent();

            const response = await API.post(`/other-details`, values);

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
        onSubmit: handleSubmit,
    });

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Bengal Credit Card */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Check
                                inline
                                label="Bengal Credit Card"
                                value={true}
                                name="bengal_credit_card"
                                type="checkbox"
                                id={`inline-1`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* CUET */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Check
                                inline
                                label="CUET (Common University Entrance Test)"
                                value={true}
                                name="cuet"
                                type="checkbox"
                                id={`inline-2`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* NAAC */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>NAAC</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => naacRef.current = editor}
                                onChange={(e) => setNaac(naacRef.current.getContent())}
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
                    {/* NIRF */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>NIRF</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => nirfRef.current = editor}
                                onChange={(e) => setNirf(nirfRef.current.getContent())}
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
                    {/* NBA */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>NBA</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => nbaRef.current = editor}
                                onChange={(e) => setNba(nbaRef.current.getContent())}
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
                    {/* AJ Ranking */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>AJ Ranking</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => ajRankingRef.current = editor}
                                onChange={(e) => setAJRanking(ajRankingRef.current.getContent())}
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

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";

export default function EditAnnouncement() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const editorRef = useRef(null);
    const [announcement, setAnnouncement] = useState("");
    const [announcementData, setAnnouncementData] = useState("");

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await API.get(`/announcement`);
                const filteredAnnouncement = response.data.filter((announcement) => announcement.propertyId === Number(uniqueId));
                setAnnouncementData(filteredAnnouncement);
            } catch (error) {
                console.error('Error fetching announcement:', error);
            }
        };

        fetchAnnouncement();
    }, [uniqueId]);

    const initialValues = {
        propertyId: uniqueId,
    }

    const handleSubmit = async (values) => {
        try {
            values = { ...values, announcement: editorRef.current.getContent() }
            const response = await API.put(`/announcement/${announcementData[0]?.uniqueId}`, values);

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
        enableReinitialize: true
    });

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Announcement */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Announcement</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => editorRef.current = editor}
                                onChange={(e) => setAnnouncement(editorRef.current.getContent())}
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
                                initialValue={announcementData[0]?.announcement} />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Update</Button>
            </Form>
        </Fragment>
    );
}

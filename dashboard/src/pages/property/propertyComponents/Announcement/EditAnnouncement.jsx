import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditAnnouncement() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [announcementData, setAnnouncementData] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/announcement`);
                const filteredAnnouncement = response.data.filter((announcement) => announcement.propertyId === Number(uniqueId));
                setAnnouncementData(filteredAnnouncement);
            } catch (error) {
                console.error('Error fetching announcement:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [uniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        announcementData: announcementData[0]?.announcement || "",
    }

    const handleSubmit = async (values) => {
        try {
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
            {loading
                ?
                <Skeleton height={300} />
                :
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        {/* Announcement */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Announcement</Form.Label>
                                <JoditEditor
                                    config={{
                                        height: 300,
                                    }}
                                    value={formik.values.announcement}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("announcement", newContent)
                                    }
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Button type="submit">Update</Button>
                </Form>
            }
        </Fragment>
    );
}

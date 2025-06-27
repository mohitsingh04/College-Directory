import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

const validationSchema = Yup.object({
    announcement: Yup.string()
        .required("Announcement description is required.")
});

export default function AddAnnouncement({ setAnnouncement, setToggleAnnouncementPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        announcement: "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post(`/announcement`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                const newAnnouncement = await API.get('/announcement');
                const filtered = newAnnouncement.data.filter((announce) => announce.propertyId === Number(uniqueId));
                setAnnouncement(filtered);
                setToggleAnnouncementPage(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed", { id: toastId });
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
                            {formik.touched.announcement && formik.errors.announcement ? (
                                <div className="text-red-500 mt-1">{formik.errors.announcement}</div>
                            ) : null}
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

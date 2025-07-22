import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import { getEditorConfig } from "../../../../services/context/editorConfig";

const validationSchema = Yup.object({
    announcement: Yup.string()
        .required("Announcement description is required.")
});

export default function EditAnnouncement({ setAnnouncement, setToggleAnnouncementPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [announcementData, setAnnouncementData] = useState("");
    const [loading, setLoading] = useState(true);
    const editorConfig = useMemo(() => getEditorConfig(), []);

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
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.put(`/announcement/${announcementData[0]?.uniqueId}`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
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
        onSubmit: handleSubmit,
        validationSchema: validationSchema,
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
                                    config={editorConfig}
                                    value={formik.values.announcementData}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("announcement", newContent)
                                    }
                                />
                                {formik.touched.announcementData && formik.errors.announcementData ? (
                                    <div className="text-red-500 mt-1">{formik.errors.announcementData}</div>
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

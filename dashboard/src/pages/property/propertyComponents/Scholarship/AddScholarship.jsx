import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

export default function AddScholarship() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        scholarship: "",
    }

    const handleSubmit = async (values) => {
        try {
            const response = await API.post(`/scholarship`, values);

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
                    {/* Scholarship */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Scholarship</Form.Label>
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.scholarship}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("scholarship", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}

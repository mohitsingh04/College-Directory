import React, { Fragment, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

export default function AddOtherDetails() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

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
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.naac}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("naac", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>
                    {/* NIRF */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>NIRF</Form.Label>
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.nirf}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("nirf", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>
                    {/* NBA */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>NBA</Form.Label>
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.nba}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("nba", newContent)
                                }
                            />
                        </Form.Group>
                    </Col>
                    {/* AJ Ranking */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>AJ Ranking</Form.Label>
                            <JoditEditor
                                config={{
                                    height: 300,
                                }}
                                value={formik.values.aj_ranking}
                                onBlur={(newContent) =>
                                    formik.setFieldValue("aj_ranking", newContent)
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

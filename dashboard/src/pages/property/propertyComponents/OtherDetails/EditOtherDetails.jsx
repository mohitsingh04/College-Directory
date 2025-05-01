import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditOtherDetails() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [otherDetails, setOtherDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOtherDetails = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/other-details`);
            const filtered = data.filter(item => item.propertyId === Number(uniqueId));
            setOtherDetails(filtered);
        } catch (error) {
            console.error('Error fetching details:', error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (uniqueId) {
            fetchOtherDetails();
        }
    }, [uniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        bengal_credit_card: otherDetails[0]?.bengal_credit_card || null,
        cuet: otherDetails[0]?.cuet || null,
        naac: otherDetails[0]?.naac || "",
        nirf: otherDetails[0]?.nirf || "",
        nba: otherDetails[0]?.nba || "",
        aj_ranking: otherDetails[0]?.aj_ranking || "",
    }

    const handleSubmit = async (values) => {
        try {
            const response = await API.put(`/other-details/${otherDetails[0]?.uniqueId}`, values);

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
                                    checked={formik.values.bengal_credit_card}
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
                                    checked={formik.values.cuet}
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
                    <Button type="submit">Update</Button>
                </Form>
            }
        </Fragment>
    );
}

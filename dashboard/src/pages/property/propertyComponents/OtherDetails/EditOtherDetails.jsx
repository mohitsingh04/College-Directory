import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import { getEditorConfig } from "../../../../services/context/editorConfig";

export default function EditOtherDetails({ setOtherDetails, setToggleOtherDetailsPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [otherDetailsData, setOtherDetailsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const editorConfig = useMemo(() => getEditorConfig(), []);

    const fetchOtherDetails = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/other-details`);
            const filtered = data.filter(item => item.propertyId === Number(uniqueId));
            setOtherDetailsData(filtered);
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
        bengal_credit_card: otherDetailsData[0]?.bengal_credit_card || null,
        cuet: otherDetailsData[0]?.cuet || null,
        naac: otherDetailsData[0]?.naac || "",
        nirf: otherDetailsData[0]?.nirf || "",
        nba: otherDetailsData[0]?.nba || "",
        aj_ranking: otherDetailsData[0]?.aj_ranking || "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.put(`/other-details/${otherDetailsData[0]?.uniqueId}`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                const newOtherDetails = await API.get('/other-details');
                const filtered = newOtherDetails.data.filter((otherDetails) => otherDetails.propertyId === Number(uniqueId));
                setOtherDetails(filtered);
                setToggleOtherDetailsPage(true);
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
                                    config={editorConfig}
                                    value={formik.values.aj_ranking}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("aj_ranking", newContent)
                                    }
                                />
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

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditHostel() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [hostel, setHostel] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostel = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/hostel`);
                const filteredHostel = response.data.filter((hostel) => hostel.propertyId === Number(uniqueId));
                setHostel(filteredHostel);
            } catch (error) {
                console.error('Error fetching hostel:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHostel();
    }, [uniqueId]);

    const initialValues = {
        propertyId: uniqueId,
        boys_hostel_fees: hostel[0]?.boys_hostel_fees || "",
        boys_hostel_description: hostel[0]?.boys_hostel_description || "",
        girls_hostel_fees: hostel[0]?.girls_hostel_fees || "",
        girls_hostel_description: hostel[0]?.girls_hostel_description || "",
    }

    const handleSubmit = async (values) => {
        try {
            const response = await API.put(`/hostel/${hostel[0]?.uniqueId}`, values);

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(0);
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
            {loading ? (
                <Skeleton height={300} />
            ) : (
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        {/* Boys Hostel Fees */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="boys_hostel_fees">Boys Hostel Fees</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="boys_hostel_fees"
                                    placeholder="Boys hostel fees"
                                    name="boys_hostel_fees"
                                    className={`form-control`}
                                    value={formik.values.boys_hostel_fees}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                        </Col>
                        {/* Boys Hostel Description */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Boys Hostel Description</Form.Label>
                                <JoditEditor
                                    config={{
                                        height: 300,
                                    }}
                                    value={formik.values.boys_hostel_description}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("boys_hostel_description", newContent)
                                    }
                                />
                            </Form.Group>
                        </Col>
                        {/* Girls Hostel Fees */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="girls_hostel_fees">Girls Hostel Fees</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="girls_hostel_fees"
                                    placeholder="Girls hostel fees"
                                    name="girls_hostel_fees"
                                    className={`form-control`}
                                    value={formik.values.girls_hostel_fees}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>
                        </Col>
                        {/* Girls Hostel Description */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Girls Hostel Description</Form.Label>
                                <JoditEditor
                                    config={{
                                        height: 300,
                                    }}
                                    value={formik.values.girls_hostel_description}
                                    onBlur={(newContent) =>
                                        formik.setFieldValue("girls_hostel_description", newContent)
                                    }
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Button type="submit">Update</Button>
                </Form>
            )}
        </Fragment>
    );
}

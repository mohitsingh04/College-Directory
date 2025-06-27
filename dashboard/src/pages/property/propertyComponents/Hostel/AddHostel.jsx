import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import * as Yup from "yup";

const validationSchema = Yup.object({
    boys_hostel_fees: Yup.number()
        .typeError("Boys hostel fees must be a number.")
        .positive("Boys hostel fees must be greater than 0.")
        .required("Boys hostel fees is required."),

    girls_hostel_fees: Yup.number()
        .typeError("Girls hostel fees must be a number.")
        .positive("Girls hostel fees must be greater than 0.")
        .required("Girls hostel fees is required."),
});

export default function AddHostel({ setHostel, setToggleHostelPage }) {
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        boys_hostel_fees: "",
        boys_hostel_description: "",
        girls_hostel_fees: "",
        girls_hostel_description: "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post(`/hostel`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                const newHostel = await API.get('/hostel');
                const filtered = newHostel.data.filter((hos) => hos.propertyId === Number(uniqueId));
                setHostel(filtered);
                setToggleHostelPage(true);
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
                    {/* Boys Hostel Fees */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="boys_hostel_fees">Boys Hostel Fees</Form.Label>
                            <Form.Control
                                type="text"
                                id="boys_hostel_fees"
                                placeholder="Boys hostel fees"
                                name="boys_hostel_fees"
                                className={`form-control ${formik.touched.boys_hostel_fees && formik.errors.boys_hostel_fees ? "is-invalid" : ""}`}
                                value={formik.values.boys_hostel_fees}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.boys_hostel_fees && formik.errors.boys_hostel_fees ? (
                                <div className="text-red-500 mt-1">{formik.errors.boys_hostel_fees}</div>
                            ) : null}
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
                                className={`form-control ${formik.touched.girls_hostel_fees && formik.errors.girls_hostel_fees ? "is-invalid" : ""}`}
                                value={formik.values.girls_hostel_fees}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.girls_hostel_fees && formik.errors.girls_hostel_fees ? (
                                <div className="text-red-500 mt-1">{formik.errors.girls_hostel_fees}</div>
                            ) : null}
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

                <Button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Adding..." : "Add"}
                </Button>
            </Form>
        </Fragment>
    );
}
import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

const validationSchema = Yup.object({
    scholarship: Yup.string()
        .required("Scholarship description is required.")
});

export default function AddScholarship({ setScholarship, setToggleScholarshipPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

    const initialValues = {
        propertyId: uniqueId,
        scholarship: "",
    }

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post(`/scholarship`, values);

            if (response.status === 200) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                const newScholarship = await API.get('/scholarship');
                const filtered = newScholarship.data.filter((scholar) => scholar.propertyId === Number(uniqueId));
                setScholarship(filtered);
                setToggleScholarshipPage(true);
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
                            {formik.touched.scholarship && formik.errors.scholarship ? (
                                <div className="text-red-500 mt-1">{formik.errors.scholarship}</div>
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

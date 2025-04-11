import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../../services/API";

export default function ChangePassword() {
    const navigate = useNavigate();

    const initialValues = {
        current_password: "",
        new_password: "",
        confirm_password: ""
    }

    const validationSchema = Yup.object({
        current_password: Yup.string()
            .required('Enter Current Password.')
            .min(6, 'Password must have at least 6 characters.'),
        new_password: Yup.string()
            .required('Enter New Password.')
            .min(6, 'Password must have at least 6 characters.'),
        confirm_password: Yup.string()
            .required('Please re-type new your password.')
            .min(6, "Password must be at least 6 characters")
            .oneOf([Yup.ref('new_password'), null], "Passwords don't match"),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await API.put("/changepassword", values);

            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 500) {
                    toast.error("Internal server error, please try again later.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } else {
                toast.error(`Registration failed: ${error.message}`);
            }
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    });

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="current_password"
                        className={`form-control ${formik.touched.current_password && formik.errors.current_password ? 'is-invalid' : ''}`}
                        placeholder="Current Password"
                        value={formik.values.current_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.current_password && formik.touched.current_password ? <div className="text-danger">{formik.errors.current_password}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="new_password"
                        placeholder="New Password"
                        className={`form-control ${formik.touched.new_password && formik.errors.new_password ? 'is-invalid' : ''}`}
                        value={formik.values.new_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.new_password && formik.touched.new_password ? <div className="text-danger">{formik.errors.new_password}</div> : null}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        className={`form-control ${formik.touched.confirm_password && formik.errors.confirm_password ? 'is-invalid' : ''}`}
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.confirm_password && formik.touched.confirm_password ? <div className="text-danger">{formik.errors.confirm_password}</div> : null}
                </Form.Group>
                <hr />
                <div className="text-end">
                    <Button type="submit">Update</Button>
                </div>
            </Form>
        </>
    )
}
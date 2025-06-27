import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap"
import ALLImages from "../../../common/Imagesdata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../../services/API";

const validationSchema = Yup.object({
    new_password: Yup.string().required("Password is required"),
    confirm_password: Yup.string().required("Confirm is required"),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            toast.error("Invalid or missing token.");
        }
    }, []);

    const initialValues = {
        new_password: "",
        confirm_password: "",
    }

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            values = { ...values, token: token }
            const response = await API.post("/resetpassword", values);

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate("/");
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
                toast.error(`Failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    });

    return (
        <Fragment>
            <div className="col-login mx-auto">
                <div className="text-center">
                    <img src={ALLImages("logo9")} className="header-brand-img" alt="Logo" />
                </div>
            </div>

            <div className="container-login100">
                <Card className="wrap-login100 p-0">
                    <Card.Body>
                        <Form className="login100-form validate-form" onSubmit={formik.handleSubmit}>
                            <span className="login100-form-title">Reset Password</span>

                            <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                                <Form.Control
                                    type="password"
                                    name="new_password"
                                    className={`form-control input100 ${formik.touched.new_password && formik.errors.new_password ? "is-invalid" : ""}`}
                                    placeholder="Password"
                                    value={formik.values.new_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.new_password && formik.errors.new_password ? (
                                    <div className="text-danger">{formik.errors.new_password}</div>
                                ) : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.new_password && formik.touched.new_password
                                        ? <i className="ri-lock-fill fixed-icon" aria-hidden="true"></i>
                                        : <i className="ri-lock-fill" aria-hidden="true"></i>
                                    }
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                                <Form.Control
                                    type="password"
                                    name="confirm_password"
                                    className={`form-control input100 ${formik.touched.confirm_password && formik.errors.confirm_password ? "is-invalid" : ""}`}
                                    placeholder="Confirm Password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                    <div className="text-danger">{formik.errors.confirm_password}</div>
                                ) : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.confirm_password && formik.touched.confirm_password
                                        ? <i className="ri-lock-fill fixed-icon" aria-hidden="true"></i>
                                        : <i className="ri-lock-fill" aria-hidden="true"></i>
                                    }
                                </span>
                            </div>

                            <div className="container-login100-form-btn">
                                <Button type="submit" className="login100-form-btn btn-primary" disabled={loading}>
                                    {loading
                                        ? <span>Reseting...</span>
                                        : <span>Reset</span>
                                    }
                                </Button>
                            </div>

                        </Form>
                    </Card.Body>

                    <div className="card-footer border-top">
                        <div className="d-flex justify-content-center my-3">
                            <Link to="#" className="social-login text-center">
                                <i className="ri-google-fill"></i>
                            </Link>
                            <Link to="#" className="social-login text-center mx-4">
                                <i className="ri-facebook-fill"></i>
                            </Link>
                            <Link to="#" className="social-login text-center">
                                <i className="ri-twitter-x-fill"></i>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </Fragment>
    )
}

export default ResetPassword

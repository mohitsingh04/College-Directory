import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import ALLImages from "../../common/Imagesdata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../services/API";
import DataRequest from "../../services/Token";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: "",
        password: ""
    }

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const response = await API.post("/login", values, { withCredentials: true });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/dashboard');
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log(error.response.data.error || "Bad Request");
                    setError(error.response.data.error);
                } else if (error.response.status === 404) {
                    setError(error.response.data.error || "Not Found!");
                } else if (error.response.status === 500) {
                    console.log("Internal server error, please try again later.");
                } else {
                    console.log("Something went wrong, please try again.");
                }
            } else {
                console.log(`Registration failed: ${error.message}`);
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
                            <span className="login100-form-title">Login</span>

                            {error ? <div className="alert alert-danger text-center mt-3">{error}</div> : <span />}

                            <div className="wrap-input100 validate-input" data-bs-validate="Email is required.">
                                <Form.Control
                                    type="email"
                                    name="email"
                                    className={`form-control input100 ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                                    placeholder="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoFocus={false}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <small className="text-danger">{formik.errors.email}</small>
                                ) : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.email && formik.touched.email
                                        ? <i className="ri-mail-fill fixed-icon" aria-hidden="true"></i>
                                        : <i className="ri-mail-fill" aria-hidden="true"></i>
                                    }
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    className={`form-control input100 ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                                    autoComplete="true"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <small className="text-danger">{formik.errors.password}</small>
                                ) : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.password && formik.touched.password
                                        ? <i className="ri-lock-fill fixed-icon" aria-hidden="true"></i>
                                        : <i className="ri-lock-fill" aria-hidden="true"></i>
                                    }
                                </span>
                            </div>

                            <div className="text-end pt-1">
                                <Link to="/forgot-password" className="text-primary">
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="container-login100-form-btn">
                                <Button type="submit" className="login100-form-btn btn-primary">
                                    {loading
                                        ? <span>Login...</span>
                                        : <span>Login</span>
                                    }
                                </Button>
                            </div>

                            <div className="text-center pt-3">
                                <p className="text-dark mb-0">
                                    Not a member?{" "}
                                    <Link to="/register" className="text-primary">
                                        Create an Account
                                    </Link>
                                </p>
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
export default Login;
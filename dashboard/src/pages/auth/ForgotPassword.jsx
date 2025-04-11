import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Form } from "react-bootstrap"
import ALLImages from "../../common/Imagesdata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../services/API";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function Forgotpassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const initialValues = {
        email: "",
    }

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            const response = await API.post("/forgotpassword", values);

            if (response.status === 200) {
                setMessage(response.data.message);
                toast.success(response.data.message);
                setLoading(true);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError(error.response.data.error)
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
            <div className="col-login mx-auto mt-7">
                <div className="text-center">
                    <img src={ALLImages('logo9')} className="header-brand-img" alt="Logo" />
                </div>
            </div>

            <div className="container-login100">
                <Row>
                    <div className="col col-login mx-auto">
                        <Form className="card shadow-none" onSubmit={formik.handleSubmit}>
                            <Card.Body>
                                <div className="text-center">
                                    <span className="login100-form-title"> Forgot Password </span>
                                    <p className="text-muted">Enter the email address registered on your account</p>
                                </div>
                                {error ? <div className="alert alert-danger text-center mt-3">{error}</div> : <span />}
                                {message ? <div className="alert alert-success text-center mt-3">{message}</div> : <span />}

                                <div className="pt-3" id="forgot">
                                    <Form.Group className="mb-1">
                                        <Form.Label>E-Mail</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            id="input"
                                            placeholder="Enter Your Email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.email && formik.touched.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                                    </Form.Group>
                                    <div className="container-login100-form-btn">
                                        <Button type="submit" className="login100-form-btn btn-primary">
                                            {loading
                                                ? <span>Wait for mail...</span>
                                                : <span>Submit</span>
                                            }
                                        </Button>
                                    </div>
                                    <div className="text-center mt-4">
                                        <p className="text-dark mb-0">Forgot It?<Link className="text-primary ms-1" to={`/login`}>Send me Back</Link></p>
                                    </div>
                                </div>
                            </Card.Body>

                            <div className="card-footer border-top">
                                <div className="d-flex justify-content-center my-3">
                                    <Link to="#" className="social-login  text-center">
                                        <i className="ri-google-fill"></i>
                                    </Link>
                                    <Link to="#" className="social-login  text-center mx-4">
                                        <i className="ri-facebook-fill"></i>
                                    </Link>
                                    <Link to="#" className="social-login  text-center">
                                        <i className="ri-twitter-x-fill"></i>
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Row>
            </div>
        </Fragment>
    );
}
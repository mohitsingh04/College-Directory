import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../services/API";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Please enter a valid email."),
    phone: Yup.string().required("Please enter a valid mobile number."),
});

export default function RegisterWithOtp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const initialValues = {
        name: "",
        email: "",
        phone: ""
    }

    const handleSubmit = async (values) => {
        values.phone = values.phone.replace(/\s+/g, '').trim(); // Remove spaces
        if (!values.phone.startsWith("+")) {
            values.phone = `+91 ${values.phone}`; // Ensure it starts with "+"
        }
        try {
            setLoading(true);
            const response = await API.post("/register-with-otp", values);
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(`/verify-otp?phone=${values.phone}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


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
                            <span className="login100-form-title">Registration</span>

                            <div className="wrap-input100 validate-input" data-bs-validate="Name is required.">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className={`form-control input100 ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.name && formik.touched.name ? <div className="text-danger">{formik.errors.name}</div> : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.name && formik.touched.name ? <i className="ri-user-fill fixed-icon" aria-hidden="true"></i> : <i className="ri-user-fill" aria-hidden="true"></i>}
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Email is required.">
                                <Form.Control
                                    type="email"
                                    className={`form-control input100 ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                                    name="email"
                                    id="input2"
                                    placeholder="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.email && formik.touched.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.email && formik.touched.email ? <i className="ri-mail-fill fixed-icon" aria-hidden="true"></i> : <i className="ri-mail-fill" aria-hidden="true"></i>}
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Phone is required">
                                <Form.Control
                                    type="text"
                                    className={`form-control input100 ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                                    name="phone"
                                    id="input3"
                                    placeholder="Phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.phone && formik.touched.phone ? <div className="text-danger">{formik.errors.phone}</div> : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.phone && formik.touched.phone ? <i className="ri-lock-fill fixed-icon" aria-hidden="true"></i> : <i className="ri-lock-fill" aria-hidden="true"></i>}
                                </span>
                            </div>

                            <div className="container-login100-form-btn">
                                <Button type="submit" className="login100-form-btn btn-primary">
                                    {loading
                                        ? <span>Requesting OTP...</span>
                                        : <span>Request OTP</span>
                                    }
                                </Button>
                            </div>

                            {error ? <div className="alert alert-danger text-center mt-3">{error} Head back to <Link to={`/`} className="text-danger"><u>login.</u></Link></div> : <span />}

                            <div className="text-center pt-3">
                                <p className="text-dark mb-0">Already have account?<Link to={`/`} className="text-primary ms-1">Sign In</Link></p>
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
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { API } from "../../services/API";
import PhoneInput from "react-phone-input-2";

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
    email: Yup.string().email("Invalid email").required("Email is required."),
    phone: Yup.string().required("Phone is required."),
    password: Yup.string().required("Password is required.").min(6, "Password must be at least 6 characters"),
});

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isChecked, setIsChecked] = useState(false);

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        password: ""
    }

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const response = await API.post("/register", values);

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(`/verify-email?email=${values.email}`);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log(error.response.data.error || "Bad Request");
                    setError(error.response.data.error);
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

                            {error ? <div className="alert alert-danger text-center mt-3">{error} Head back to <Link to={`/`} className="text-danger"><u>login.</u></Link></div> : <span />}

                            <div className="wrap-input100 validate-input" data-bs-validate="Name is required.">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className={`form-control input100 ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoFocus={false}
                                />
                                {formik.errors.name && formik.touched.name ? <small className="text-danger">{formik.errors.name}</small> : null}
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
                                {formik.errors.email && formik.touched.email ? <small className="text-danger">{formik.errors.email}</small> : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.email && formik.touched.email ? <i className="ri-mail-fill fixed-icon" aria-hidden="true"></i> : <i className="ri-mail-fill" aria-hidden="true"></i>}
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Phone is required.">
                                <PhoneInput
                                    country={'in'}
                                    value={formik.values.phone}
                                    inputClass={`border w-100 ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                                    inputStyle={{ height: "45px" }}
                                    buttonClass={`bg-white border ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                                    onChange={(value) => formik.setFieldValue("phone", value)}
                                    onBlur={formik.handleBlur("phone")}
                                />
                                {formik.errors.phone && formik.touched.phone ? <small className="text-danger">{formik.errors.phone}</small> : null}
                            </div>

                            <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                                <Form.Control
                                    type="password"
                                    className={`form-control input100 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    id="input3"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.password && formik.touched.password ? <small className="text-danger">{formik.errors.password}</small> : null}
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    {formik.errors.password && formik.touched.password ? <i className="ri-lock-fill fixed-icon" aria-hidden="true"></i> : <i className="ri-lock-fill" aria-hidden="true"></i>}
                                </span>
                            </div>

                            <label className="custom-control custom-checkbox mt-4">
                                <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="..." onChange={(e) => { setIsChecked(e.target.checked) }} />
                                <span className="custom-control-label ms-1">Agree the <Link to={`/terms-and-policy`} className="text-primary">terms and policy</Link></span>
                            </label>

                            <div className="container-login100-form-btn">
                                <Button type="submit" className="login100-form-btn btn-primary" disabled={!isChecked || loading}>
                                    {loading
                                        ? <span>Registering...</span>
                                        : <span>Register</span>
                                    }
                                </Button>
                            </div>

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
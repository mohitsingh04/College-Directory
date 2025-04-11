import React, { Fragment, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";

const Register = () => {

  return (
    <Fragment>
      <div className="col-login mx-auto mt-7">
        <div className="text-center">
          <img src={ALLImages('logo2')} className="header-brand-img" alt="" />
        </div>
      </div>
      <div className="container-login100">
        <Card className="wrap-login100 p-0">
          <Card.Body>
            <Form className="login100-form validate-form">
              <span className="login100-form-title"> Registration </span>
              <div className="wrap-input100 validate-input" data-bs-validate="Valid email is required: ex@abc.xyz">
                <Form.Control type="text" className="input100" name="email" id="input1" placeholder="User name" />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="ri-user-fill" aria-hidden="true"></i>
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-bs-validate="Valid email is required: ex@abc.xyz">
                <Form.Control type="text" className="input100" name="email" id="input2" placeholder="Email" />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="ri-mail-fill" aria-hidden="true"></i>
                </span>
              </div>
              <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                <Form.Control type="password" className="input100" name="email" id="input3" placeholder="Password" />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="ri-lock-fill" aria-hidden="true"></i>
                </span>
              </div>
              <label className="custom-control custom-checkbox mt-4">
                <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="..." />
                <span className="custom-control-label ms-1">Agree the <Link to={`${import.meta.env.BASE_URL}pages/terms/`} className="text-primary">terms and policy</Link></span>
              </label>
              <div className="container-login100-form-btn">
                <Link to={`${import.meta.env.BASE_URL}dashboard/`} className="login100-form-btn btn-primary"> Register </Link>
              </div>
              <div className="text-center pt-3">
                <p className="text-dark mb-0">Already have account?<Link to={`${import.meta.env.BASE_URL}login/`} className="text-primary ms-1">Sign In</Link></p>
              </div>
            </Form>
          </Card.Body>
          <div className="card-footer border-top">
            <div className="d-flex justify-content-center my-3">
              <Link to="#" className="social-login text-center"> <i className="ri-google-fill"></i> </Link>
              <Link to="#" className="social-login text-center mx-4"> <i className="ri-facebook-fill"></i> </Link>
              <Link to="#" className="social-login text-center"> <i className="ri-twitter-x-fill"></i> </Link>
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  )
}

export default Register;
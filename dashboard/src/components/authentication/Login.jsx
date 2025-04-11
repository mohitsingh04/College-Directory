import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Form } from "react-bootstrap";
import ALLImages from "../../common/Imagesdata";

const Login = () => {

  return (
    <Fragment>
      <div className="col-login mx-auto">
        <div className="text-center">
          <img src={ALLImages('logo2')} className="header-brand-img" alt="" />
        </div>
      </div>
      <div className="container-login100">
        <Card className="wrap-login100 p-0">
          <Card.Body>
            <Form className="login100-form validate-form">
              <span className="login100-form-title"> Login </span>
              <div className="wrap-input100 validate-input" data-bs-validate="Valid email is required: ex@abc.xyz">
                <Form.Control type="text" className="input100" name="email" id="input" placeholder="Email" />
                <span className="focus-input100"></span>
                <span className="symbol-input100"> <i className="ri-mail-fill" aria-hidden="true"></i> </span>
              </div>
              <div className="wrap-input100 validate-input" data-bs-validate="Password is required">
                <Form.Control type="password" className="input100" name="email" id="input2" placeholder="Password" />
                <span className="focus-input100"></span>
                <span className="symbol-input100"> <i className="ri-lock-fill" aria-hidden="true"></i> </span>
              </div>
              <div className="text-end pt-1">
                <p className="mb-0"><Link to={`${import.meta.env.BASE_URL}forgotpassword/`} className="text-primary ms-1">Forgot Password?</Link></p>
              </div>
              <div className="container-login100-form-btn">
                <Link to={`${import.meta.env.BASE_URL}dashboard/`} className="login100-form-btn btn-primary"> Login </Link>
              </div>
              <div className="text-center pt-3">
                <p className="text-dark mb-0">Not a member?<a href={`${import.meta.env.BASE_URL}register/`} className="text-primary ms-1 d-inline-flex">Create an Account</a></p>
              </div>
            </Form>
          </Card.Body>
          <div className="card-footer border-top">
            <div className="d-flex justify-content-center my-3">
              <Link to="#" className="social-login  text-center"> <i className="ri-google-fill"></i> </Link>
              <Link to="#" className="social-login  text-center mx-4"> <i className="ri-facebook-fill"></i> </Link>
              <Link to="#" className="social-login  text-center"> <i className="ri-twitter-x-fill"></i> </Link>
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  )
}

export default Login
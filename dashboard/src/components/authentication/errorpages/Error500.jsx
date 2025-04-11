import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Error500 = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard");
    window.location.reload();
  }

  return (
    <div className="page">
      <div className="page-content error-page error2">
        <div className="container text-center">
          <div className="error-template">
            <h1 className="display-1 text-fixed-white mb-2">
              500<span className="fs-20">error</span>
            </h1>
            <h5 className="error-details text-fixed-white">
              Sorry, an error has occured, Requested page not found!
            </h5>
            <div className="text-center">
              <button onClick={handleNavigate} className="btn btn-primary mt-5 mb-5">
                <i className="fa fa-long-arrow-left"></i> Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error500;
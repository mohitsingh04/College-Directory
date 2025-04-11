import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";

export default function ViewPermission() {
  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div className="">
          <h1 className="page-title fw-semibold fs-20 mb-0">View Permission</h1>
          <div className="">
            <Breadcrumb className='mb-0'>
              <Breadcrumb.Item>
                <Link to={'/dashboard'}>
                  Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={'/dashboard/role-and-permission'}>
                  Permission
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>View</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">View Permission</h3>
          <div className="card-options ms-auto">
            <Link to={"/dashboard/role-and-permission"}>
              <button type="button" className="btn btn-md btn-primary">
                <i className="fe fe-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <h1>View Permission</h1>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

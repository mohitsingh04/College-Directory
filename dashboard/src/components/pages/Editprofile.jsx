import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Card, Form, FormGroup, FormControl, ListGroup, Breadcrumb, Table } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { EditprofileData, optionDateofbirth, optionselectdate, optionselectyear } from "../../common/Commomarreydata";
import ALLImages from "../../common/Imagesdata";
import Select from 'react-select'

const Editprofile = () => {

  return (
    <Fragment>
      <Pageheader homepage='Edit profile' activepage='Pages' page='Edit profile' />
      <Row>
        <Col xl={4} md={12} sm={12}>
          <Card className="custom-card edit-password-section">
            <Card.Header>
              <div className="card-title">Edit Password</div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <img alt="User Avatar" className="rounded-circle avatar-lg avatar me-2" src={ALLImages('face8')} />
                <div className="ms-auto mt-xl-2 mt-lg-0 me-lg-2">
                  <Link to={`${import.meta.env.BASE_URL}pages/editprofile/`} className="btn btn-primary btn-sm mt-1 mb-1 me-2"><i className="fe fe-camera me-1 float-start mt-1"></i>Edit profile</Link>
                  <Link to="#" className="btn btn-danger btn-sm mt-1 mb-1"><i className="fe fe-camera-off me-1 mt-1 float-start"></i>Delete profile</Link>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Change Password</Form.Label>
                <Form.Control type="password" defaultValue="password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" defaultValue="password" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" defaultValue="password" />
              </Form.Group>
            </Card.Body>
            <div className="card-footer text-end">
              <Link to="#" className="btn btn-primary me-2">Updated</Link>
              <Link to="#" className="btn btn-danger">Cancel</Link>
            </div>
          </Card>
          <Card className="custom-card panel-theme">
            <Card.Header>
              <div className="float-start">
                <h3 className="card-title">Contact</h3>
              </div>
              <div className="clearfix"></div>
            </Card.Header>
            <Card.Body className="no-padding">
              <ListGroup className="no-margin">
                <ListGroup.Item>
                  <Link to="#" className="d-flex">
                    <i className="bi bi-envelope-fill list-contact-icons border text-center br-100"></i>
                    <span className="contact-icons  ms-2 my-auto">support@demo.com</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item><Link to="#" className="d-flex"><i className="fe fe-globe list-contact-icons border text-center br-100"></i><span className="contact-icons  ms-2 my-auto"> www.abcd.com</span></Link></ListGroup.Item>
                <ListGroup.Item><Link to="#" className="d-flex"><i className="fe fe-phone list-contact-icons border text-center br-100"></i> <span className="contact-icons  ms-2 my-auto">+125 5826 3658 </span></Link></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={8} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header>
              <h3 className="card-title">Edit Profile</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="exampleInputname">First Name</Form.Label>
                    <Form.Control type="text" id="exampleInputname" placeholder="First Name" />
                  </Form.Group>
                </Col>
                <Col lg={6} md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="exampleInputname1">Last Name</Form.Label>
                    <Form.Control type="text" id="exampleInputname1" placeholder="Enter Last Name" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="exampleInputEmail1">Email address</Form.Label>
                <Form.Control type="email" id="exampleInputEmail1" placeholder="email address" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="exampleInputnumber">Conatct Number</Form.Label>
                <Form.Control type="number" id="exampleInputnumber" placeholder="ph number" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>About Me</Form.Label>
                <Form.Control as='textarea' rows="6" defaultValue='My bio.........' />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control placeholder="http://splink.com" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date Of Birth</Form.Label>
                <Row>
                  <Col md={4} className="mb-2">
                    <Select options={optionselectdate} classNamePrefix="Select2" placeholder='Date' />
                  </Col>
                  <div className="col-md-4 mb-2">
                    <Select options={optionDateofbirth} classNamePrefix="Select2" placeholder='Month' />
                  </div>
                  <div className="col-md-4 mb-2">
                    <Select options={optionselectyear} classNamePrefix="Select2" placeholder='Year' />
                  </div>
                </Row>
              </Form.Group>
            </Card.Body>
            <div className="card-footer text-end">
              <Link to="#" className="btn btn-success mt-1 me-2">Save</Link>
              <Link to="#" className="btn btn-danger mt-1">Cancel</Link>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <div className="col-12">
          <Card className="custom-card">
            <Card.Header>
              <h3 className="card-title">Projects</h3>
              <div className="card-options ms-auto">
                <button type="button" className="btn btn-md btn-primary"><i className="fa fa-plus"></i> Add a new Project</button>
              </div>
            </Card.Header>
            <div className="table-responsive">
              <table className="table text-nowrap table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Project Name</th>
                    <th scope="col">Backend</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Team Members</th>
                    <th scope="col">Edit Project Details </th>
                    <th scope="col">list info</th>
                  </tr>
                </thead>
                <tbody>
                  {EditprofileData.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.language}</td>
                      <td>{item.date}</td>
                      <td>{item.members}</td>
                      <td>
                        <Link className="btn btn-sm btn-primary me-2" to="#"><i className="fe fe-edit"></i> Edit</Link>
                        <Link className="btn btn-sm btn-danger" to="#"><i className="fe fe-trash"></i> Delete</Link>
                      </td>
                      <td>
                        <Link className="btn btn-sm btn-secondary" to="#"><i className="fe fe-info-circle"></i> Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Row>
    </Fragment>
  )
}

export default Editprofile;
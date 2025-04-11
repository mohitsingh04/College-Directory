import React, { Fragment, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import LoadingBar from 'react-top-loading-bar';
import Dropdown from "react-dropdown-select";
import PhoneInput from "react-phone-input-2";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
  email: Yup.string().required("Email is required."),
  phone: Yup.string().required("Phone Number is required."),
});

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const loadingBarRef = useRef(null);
  const [role, setRole] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        startLoadingBar();
        const [roles, permissions] = await Promise.all([
          API.get("/roles"),
          API.get("/permissions"),
        ]);

        setRole(roles?.data);
        setPermissionData(permissions?.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const getAuthUserData = async () => {
      try {
        setHandlePermissionLoading(true)
        const { data } = await API.get("/profile");
        setAuthUser(data?.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setHandlePermissionLoading(false)
      }
    }

    getAuthUserData();
  }, []);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    role: "",
    permission: [],
  };

  const handleSubmit = async (values) => {
    try {
      startLoadingBar();
      setLoading(true)
      const response = await API.post("/user", values);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/dashboard/users');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.error || "Bad Request");
          setError(error.response.data.error);
        } else if (error.response.status === 500) {
          toast.error("Internal server error, please try again later.");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      } else {
        toast.error(`Registration failed: ${error.message}`);
      }
    } finally {
      stopLoadingBar();
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    document.title = "AJ | Add User";
  }, []);

  useEffect(() => {
    if (authUser) {
      if (authUser?.role !== "Super Admin" && authUser?.role !== "Admin") {
        return navigate("/dashboard");
      }
    }
  }, [authUser]);

  const hasPermission = authUser?.permission?.some(
    (item) => item.value === "Create User"
  );

  if (!handlePermissionLoading && authUser) {
    if (!hasPermission) {
      return (
        <div className="position-absolute top-50 start-50 translate-middle">
          USER DOES NOT HAVE THE RIGHT ROLES.
        </div>
      );
    }
  }

  return (
    <Fragment>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Add User</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/dashboard/users">User</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Add</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Add User</h3>
          <Link to="/dashboard/users">
            <Button variant="primary">
              <i className="fe fe-arrow-left"></i> Back
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              {/* Name */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userName">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="userName"
                    placeholder="Enter user name"
                    name="name"
                    className={`form-control ${formik.touched.name && formik.errors.name
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-danger">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Email */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userEmail">Email</Form.Label>
                  <Form.Control
                    type="email"
                    id="userEmail"
                    placeholder="Enter user email"
                    name="email"
                    className={`form-control ${formik.touched.email && formik.errors.email
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Phone number */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userPhone">Phone number</Form.Label>
                  {/* <Form.Control
                    type="text"
                    id="userPhone"
                    placeholder="Enter phone number"
                    name="phone"
                    className={`form-control ${formik.touched.phone && formik.errors.phone
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  /> */}
                  <PhoneInput
                    country={'in'}
                    value={formik.values.phone}
                    inputClass={`border w-100 ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                    inputStyle={{ height: "45px" }}
                    buttonClass={`bg-white border ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                    onChange={(value) => formik.setFieldValue("phone", value)}
                    onBlur={formik.handleBlur("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Role */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userRole">Role</Form.Label>
                  <select
                    id="userRole"
                    name="role"
                    className={`form-control ${formik.touched.role && formik.errors.role
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">--Select--</option>
                    {role.map((item) => (
                      <option key={item.uniqueId} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </Form.Group>
              </Col>
              {/* Permission */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userPermission">Permission</Form.Label>
                  <Dropdown
                    options={permissionData.map((group) => ({ label: group.name, value: group.name }))}
                    keepSelectedInList={false}
                    multi={true}
                    placeholder="Choose Permissions   "
                    value={formik.values.permission}
                    onChange={(value) => formik.setFieldValue("permission", value)}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
            </Row>
            {error ? <div className="alert alert-danger text-center">{error}</div> : null}
            <Button type="submit" variant="primary">
              {loading
                ? <span>Add User</span>
                : <span>Adding User...</span>
              }
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddUser;

import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import Dropdown from "react-dropdown-select";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import LoadingBar from 'react-top-loading-bar';
import PhoneInput from "react-phone-input-2";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required."),
  email: Yup.string().required("Email is required."),
  phone: Yup.string().required("Phone Number is required."),
  address: Yup.string().min(2, "Address must contain atleast 2 characters"),
  pincode: Yup.string().required("Pincode is required."),
});

const EditUser = () => {
  const { objectId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [role, setRole] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const loadingBarRef = useRef(null);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

  useEffect(() => {
    const fetchData = async () => {
      startLoadingBar();
      try {
        const [countryRes, stateRes, cityRes] = await Promise.all([
          API.get("/fetch-country"),
          API.get("/fetch-states"),
          API.get("/fetch-city")
        ]);
        setCountries(countryRes?.data);
        setStates(stateRes?.data);
        setCities(cityRes?.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getAuthUserData = async () => {
      setHandlePermissionLoading(true)
      try {
        const { data } = await API.get("/profile");
        setAuthUser(data?.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setHandlePermissionLoading(false)
      }
    }

    const getStatusData = async () => {
      startLoadingBar();
      try {
        const response = await API.get("/status");
        const filteredStatus = response?.data.filter((item) => item.parent_status === "User");
        setStatus(filteredStatus);
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    }

    getAuthUserData();
    getStatusData();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      startLoadingBar();
      try {
        const [userData, roles, permissionsRes] = await Promise.all([
          API.get(`/user/${objectId}`),
          API.get("/roles"),
          API.get("/permissions"),
        ]);

        setUser(userData?.data);
        setRole(roles?.data);
        setPermissionData(
          permissionsRes.data.map((perm) => ({
            label: perm.name,
            value: perm.name,
          }))
        );
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    };

    fetchAllData();
  }, [objectId]);

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    role: user?.role || "",
    permission: user?.permission || [],
    status: user?.status || "",
  };

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    startLoadingBar();
    try {
      if (!values.permission || values.permission.length === 0) {
        toast.error("Please select at least one permission.", { id: toastId });
        stopLoadingBar();
        return;
      }

      const response = await API.put(`/user/${objectId}`, values);
      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully", { id: toastId });
        navigate('/dashboard/users');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed", { id: toastId });
    } finally {
      stopLoadingBar();
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  useEffect(() => {
    document.title = "AJ | Edit User";
  }, []);

  useEffect(() => {
    if (authUser) {
      if (authUser?.role !== "Super Admin" && authUser?.role !== "Admin") {
        return navigate("/dashboard");
      }
    }
  }, [authUser]);

  const hasPermission = authUser?.permission?.some(
    (item) => item.value === "Update User"
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

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      formik.setFieldValue("permission", permissionData);
    } else {
      formik.setFieldValue("permission", []);
    }
  };

  useEffect(() => {
    if (formik.values.permission.length === permissionData.length && permissionData.length !== 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [formik.values.permission, permissionData]);

  const filteredStates = states.filter((item) => item.country_name === formik.values.country);
  const filteredCities = cities.filter((item) => item.state_name === formik.values.state);

  return (
    <Fragment>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">Edit User</h1>
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/dashboard/users">User</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Edit</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Edit User</h3>
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
                  // disabled
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
                  <PhoneInput
                    country={'in'}
                    value={formik.values.phone}
                    inputClass={`border w-100 ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                    inputStyle={{ height: "45px" }}
                    buttonClass={`bg-white border ${formik.touched.phone && formik.errors.phone ? "border-danger" : ""}`}
                    onChange={(value) => formik.setFieldValue("phone", value)}
                    onBlur={formik.handleBlur("phone")}
                  // disabled
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-danger">
                      {formik.errors.phone}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Address */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userAddress">Address</Form.Label>
                  <Form.Control
                    type="text"
                    id="userAddress"
                    placeholder="Enter user address"
                    name="address"
                    className={`form-control ${formik.touched.address && formik.errors.address
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-danger">
                      {formik.errors.address}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Pincode */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userPincode">Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    id="userPincode"
                    placeholder="Enter user pincode"
                    name="pincode"
                    className={`form-control ${formik.touched.pincode && formik.errors.pincode
                      ? "is-invalid"
                      : ""
                      }`}
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.pincode && formik.errors.pincode ? (
                    <div className="text-danger">
                      {formik.errors.pincode}
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
              {/* Coutries */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="country"
                    value={formik.values.country}
                    onChange={(e) => {
                      formik.setFieldValue("country", e.target.value);
                      formik.setFieldValue("state", "");
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select Country</option>
                    {countries.map((item) => (
                      <option key={item.id} value={item.country_name}>{item.country_name}</option>
                    ))}
                  </Form.Select>
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-danger">{formik.errors.country}</div>
                  )}
                </Form.Group>
              </Col>
              {/* States */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state"
                    value={formik.values.state}
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select State</option>
                    {filteredStates.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </Form.Select>
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-danger">{formik.errors.state}</div>
                  )}
                </Form.Group>
              </Col>
              {/* Cities */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Select
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select City</option>
                    {filteredCities.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </Form.Select>
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-danger">{formik.errors.city}</div>
                  )}
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
                    onChange={(e) => {
                      const selectedRole = e.target.value;
                      formik.setFieldValue("role", selectedRole);

                      if (selectedRole === "Super Admin") {
                        formik.setFieldValue("permission", permissionData);
                      } else if (selectedRole === "Admin") {
                        formik.setFieldValue("permission", permissionData);
                      } else {
                        formik.setFieldValue("permission", []);
                      }
                    }}
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
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userPermission">Permission</Form.Label>
                  <Dropdown
                    options={permissionData}
                    keepSelectedInList={false}
                    multi={true}
                    placeholder="Choose Permissions   "
                    value={user?.permission}
                    values={formik.values.permission}
                    onChange={(value) => formik.setFieldValue("permission", value)}
                    onBlur={formik.handleBlur}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Select All Permissions"
                    className="mt-2"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </Form.Group>
              </Col>
              {/* Status */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userStatus">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className=""
                  >
                    <option value="">Select Status</option>
                    {status.map((item) => (
                      <option key={item.uniqueId} value={item.status_name}>{item.status_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default EditUser;

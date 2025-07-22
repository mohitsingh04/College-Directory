import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import Dropdown from "react-dropdown-select";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import LoadingBar from "react-top-loading-bar";
import JoditEditor from "jodit-react";
import { getEditorConfig } from "../../services/context/editorConfig";

export default function AddCourse() {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toggleHideShow, setToggleHideShow] = useState(false);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const loadingBarRef = useRef(null);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
  const editorConfig = useMemo(() => getEditorConfig(), []);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

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

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        startLoadingBar();
        const response = await API.get(`/category`);
        const filteredCategory = response?.data.filter((category) => category?.status === "Active");
        setCategoryData(filteredCategory);
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    };

    getCategoryData();
  }, []);

  const initialValues = {
    name: "",
    short_name: "",
    description: "",
    eligibility: "",
    course_duration: "",
    course_duration_unit: "",
    specialization: "",
    course_type: "",
    program_type: "",
    category: "",
    sub_category: "",
    stream: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
    short_name: Yup.string().required("Short Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
    specialization: Yup.string().required("Specialization is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Specialization can contain only alphabets and single spaces.').min(2, "Specialization must contain atleast 2 characters"),
    course_duration: Yup.string().required("Duration is required."),
    course_duration_unit: Yup.string().required("Duration unit is required."),
    program_type: Yup.string().required("Program type is required."),
  });

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    startLoadingBar();
    try {
      const formData = { ...values, duration: `${values.course_duration} ${values.course_duration_unit}` };
      const response = await API.post("/course", formData);

      toast.success(response.data.message || "Added successfully", { id: toastId });
      navigate('/dashboard/course');
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed", { id: toastId });
    } finally {
      stopLoadingBar();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const CourseTypeData = [
    { value: "Degree", label: "Degree" },
    { value: "Diploma", label: "Diploma" },
    { value: "Certification", label: "Certification" },
  ];

  const handleCategory = (value) => {
    const category = formik.setFieldValue("category", value);
    setSelectedCategory(value[0].value)
    setToggleHideShow(category ? true : false);
  }

  const handleSubCategory = (value) => {
    formik.setFieldValue("sub_category", value)
  }

  useEffect(() => {
    const filteredData = categoryData.filter((item) => item.category_name === selectedCategory);
    setFilteredSubCategory(filteredData)
  }, [selectedCategory, categoryData]);

  useEffect(() => {
    document.title = "AJ | Add Course";
  }, []);

  const hasPermission = authUser?.permission?.some(
    (item) => item.value === "Read Status"
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
        <div className="">
          <h1 className="page-title fw-semibold fs-20 mb-0">Add Course</h1>
          <div className="">
            <Breadcrumb className='mb-0'>
              <Breadcrumb.Item>
                <Link to={'/dashboard'}>
                  Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={'/dashboard/course'}>
                  Course
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Add</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">Add Course</h3>
          <div className="card-options ms-auto">
            <Link to={"/dashboard/course"}>
              <button type="button" className="btn btn-md btn-primary">
                <i className="fe fe-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <Row>
              {/* Name */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="courseName">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="courseName"
                    placeholder="Name"
                    name="name"
                    className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && formik.touched.name ? <div className="text-danger mt-1">{formik.errors.name}</div> : null}
                </Form.Group>
              </Col>
              {/* Short Name */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="courseShortName">Short Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="courseShortName"
                    placeholder="Short Name"
                    name="short_name"
                    className={`form-control ${formik.touched.short_name && formik.errors.short_name ? 'is-invalid' : ''}`}
                    value={formik.values.short_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.short_name && formik.touched.short_name ? <div className="text-danger mt-1">{formik.errors.short_name}</div> : null}
                </Form.Group>
              </Col>
              {/* Specialization */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="specialization">Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    id="specialization"
                    placeholder="General, etc..."
                    name="specialization"
                    className={`form-control ${formik.touched.specialization && formik.errors.specialization ? 'is-invalid' : ''}`}
                    value={formik.values.specialization}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.specialization && formik.touched.specialization ? <div className="text-danger mt-1">{formik.errors.specialization}</div> : null}
                </Form.Group>
              </Col>
              {/* Duration */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="course_duration">Duration</Form.Label>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Control
                      type="text"
                      id="course_duration"
                      placeholder="Duration..."
                      name="course_duration"
                      className={`form-control ${formik.touched.course_duration && formik.errors.course_duration ? 'is-invalid' : ''}`}
                      value={formik.values.course_duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{ marginRight: '10px' }}
                    />
                    <Form.Select
                      name="course_duration_unit"
                      className={`form-control ${formik.touched.course_duration_unit && formik.errors.course_duration_unit ? 'is-invalid' : ''}`}
                      value={formik.values.course_duration_unit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Duration</option>
                      <option value="Months">Months</option>
                      <option value="Years">Years</option>
                    </Form.Select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {formik.errors.course_duration && formik.touched.course_duration ? <div className="text-danger mt-1">{formik.errors.course_duration}</div> : null}
                    {formik.errors.course_duration_unit && formik.touched.course_duration_unit ? <div className="text-danger mt-1">{formik.errors.course_duration_unit}</div> : null}
                  </div>
                </Form.Group>
              </Col>
              {/* Course Type */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="course_type">Course Type</Form.Label>
                  <Dropdown
                    options={CourseTypeData}
                    values={[]}
                    closeOnSelect={false}
                    placeholder="Choose Type  "
                    keepSelectedInList={false}
                    searchable={false}
                    dropdownHandle={false}
                    value={formik.values.course_type}
                    onChange={(value) => formik.setFieldValue("course_type", value)}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Row>
                  {/* Category */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="category">Category</Form.Label>
                      <Dropdown
                        options={categoryData
                          .filter((item) => item.category_name === "Course")
                          .map((group) => ({
                            label: group.parent_category,
                            value: group.parent_category,
                          }))}
                        values={[]}
                        closeOnSelect={false}
                        placeholder="Choose Category    "
                        keepSelectedInList={false}
                        searchable={false}
                        dropdownHandle={false}
                        value={formik.values.category}
                        // onChange={(value) => formik.setFieldValue("category", value)}
                        onChange={handleCategory}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  {/* Sub Category */}
                  {toggleHideShow && (
                    <>
                      {filteredSubCategory.length > 0 ? (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="sub_category">Sub Category</Form.Label>
                            <Dropdown
                              options={filteredSubCategory.map((group) => ({
                                label: group.parent_category,
                                value: group.parent_category,
                              }))}
                              values={[]}
                              closeOnSelect={false}
                              placeholder="Choose Sub Category   "
                              keepSelectedInList={false}
                              searchable={false}
                              dropdownHandle={false}
                              value={formik.values.sub_category}
                              // onChange={(value) => formik.setFieldValue("sub_category", value)}
                              onChange={handleSubCategory}
                              onBlur={formik.handleBlur}
                            />
                          </Form.Group>
                        </Col>
                      ) : null}
                    </>
                  )}
                </Row>
              </Col>
              {/* Stream */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="stream">Stream</Form.Label>
                  <Dropdown
                    options={categoryData
                      .filter((item) => item.category_name === "Stream")
                      .map((group) => ({
                        label: group.parent_category,
                        value: group.parent_category,
                      }))}
                    values={[]}
                    closeOnSelect={false}
                    placeholder="Choose Stream   "
                    keepSelectedInList={false}
                    searchable={false}
                    dropdownHandle={false}
                    value={formik.values.stream}
                    onChange={(value) => formik.setFieldValue("stream", value)}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
              {/* Program Type */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="program_type">Program Type</Form.Label>
                  <br />
                  {['UG', 'PG', 'Diploma'].map((type, index) => (
                    <div key={index} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="program_type"
                        id={`inlineRadio${index + 1}`}
                        value={type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label className="form-check-label" htmlFor={`inlineRadio${index + 1}`}>{type}</label>
                    </div>
                  ))}
                  {formik.errors.program_type && formik.touched.program_type ? <div className="text-danger mt-1">{formik.errors.program_type}</div> : null}
                </Form.Group>
              </Col>
              {/* Eligibility */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="eligibility">Eligibility</Form.Label>
                  <Form.Control
                    // type="text"
                    as="textarea"
                    id="eligibility"
                    placeholder="Eligibility"
                    name="eligibility"
                    value={formik.values.eligibility}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.eligibility && formik.touched.eligibility ? <div className="text-danger mt-1">{formik.errors.eligibility}</div> : null}
                </Form.Group>
              </Col>
              {/* Description */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userName">Description</Form.Label>
                  <JoditEditor
                    config={editorConfig}
                    value={formik.values.description}
                    onBlur={(newContent) =>
                      formik.setFieldValue("description", newContent)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Adding..." : "Add"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
}

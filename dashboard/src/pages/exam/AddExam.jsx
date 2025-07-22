import React, { Fragment, useRef, useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import Dropdown from "react-dropdown-select";
import LoadingBar from 'react-top-loading-bar';
import JoditEditor from "jodit-react";
import { getEditorConfig } from "../../services/context/editorConfig";

export default function AddExam() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const loadingBarRef = useRef(null);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
      const editorConfig = useMemo(() => getEditorConfig(), []);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

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

    getAuthUserData();
  }, []);

  const initialValues = {
    name: "",
    short_name: "",
    description: "",
    upcoming_exam_date: "",
    result_date: "",
    youtube_link: "",
    application_form_date: "",
    exam_mode: "",
    application_form_link: "",
    exam_form_link: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
    short_name: Yup.string().required("Short name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Short name can contain only alphabets and single spaces.').min(2, "Short name must contain atleast 2 characters"),
    upcoming_exam_date: Yup.string().required("Upcoming exam date is required."),
    result_date: Yup.string().required("Result date is required."),
    application_form_date: Yup.string().required("Application form date is required."),
    application_form_link: Yup.string().required("Application form link is required."),
    exam_form_link: Yup.string().required("Exam form link is required."),
  });

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    startLoadingBar();
    try {
      const response = await API.post("/exam", values);

      toast.success(response.data.message || "Updated successfully", { id: toastId });
      navigate('/dashboard/exam');
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed", { id: toastId });
    } finally {
      stopLoadingBar();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const ExamModeData = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  useEffect(() => {
    document.title = "AJ | Add Exam";
  }, []);

  const hasPermission = authUser?.permission?.some(
    (item) => item.value === "Create Exam"
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
          <h1 className="page-title fw-semibold fs-20 mb-0">Add Exam</h1>
          <div className="">
            <Breadcrumb className='mb-0'>
              <Breadcrumb.Item>
                <Link to={'/dashboard'}>
                  Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={'/dashboard/exam'}>
                  Exam
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Add</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">Add Exam</h3>
          <div className="card-options ms-auto">
            <Link to={"/dashboard/exam"}>
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
                  <Form.Label htmlFor="examName">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="examName"
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
                  <Form.Label htmlFor="examShortName">Short Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="examShortName"
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
              {/* Upcoming Exam Date */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="upcoming_exam_date">Upcoming Exam Date</Form.Label>
                  <Form.Control
                    type="date"
                    id="upcoming_exam_date"
                    name="upcoming_exam_date"
                    className={`form-control ${formik.touched.upcoming_exam_date && formik.errors.upcoming_exam_date ? 'is-invalid' : ''}`}
                    value={formik.values.upcoming_exam_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.upcoming_exam_date && formik.touched.upcoming_exam_date ? <div className="text-danger mt-1">{formik.errors.upcoming_exam_date}</div> : null}
                </Form.Group>
              </Col>
              {/* Result Date */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="result_date">Result Date</Form.Label>
                  <Form.Control
                    type="date"
                    id="result_date"
                    name="result_date"
                    className={`form-control ${formik.touched.result_date && formik.errors.result_date ? 'is-invalid' : ''}`}
                    value={formik.values.result_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.result_date && formik.touched.result_date ? <div className="text-danger mt-1">{formik.errors.result_date}</div> : null}
                </Form.Group>
              </Col>
              {/* Application Form Date */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="application_form_date">Application Form Date</Form.Label>
                  <Form.Control
                    type="date"
                    id="application_form_date"
                    name="application_form_date"
                    className={`form-control ${formik.touched.application_form_date && formik.errors.application_form_date ? 'is-invalid' : ''}`}
                    value={formik.values.application_form_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.application_form_date && formik.touched.application_form_date ? <div className="text-danger mt-1">{formik.errors.application_form_date}</div> : null}
                </Form.Group>
              </Col>
              {/* Youtube Link */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="youtube_link">Youtube Link</Form.Label>
                  <Form.Control
                    type="text"
                    id="youtube_link"
                    placeholder="Youtube Link"
                    name="youtube_link"
                    value={formik.values.youtube_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.youtube_link && formik.touched.youtube_link ? <div className="text-danger mt-1">{formik.errors.youtube_link}</div> : null}
                </Form.Group>
              </Col>
              {/* Application Form Link */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="application_form_link">Application Form Link</Form.Label>
                  <Form.Control
                    type="text"
                    id="application_form_link"
                    placeholder="Application Form Link"
                    name="application_form_link"
                    className={`form-control ${formik.touched.application_form_link && formik.errors.application_form_link ? 'is-invalid' : ''}`}
                    value={formik.values.application_form_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.application_form_link && formik.touched.application_form_link ? <div className="text-danger mt-1">{formik.errors.application_form_link}</div> : null}
                </Form.Group>
              </Col>
              {/* Exam Form Link */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="exam_form_link">Exam Form Link</Form.Label>
                  <Form.Control
                    type="text"
                    id="exam_form_link"
                    placeholder="Exam Form Link"
                    name="exam_form_link"
                    className={`form-control ${formik.touched.exam_form_link && formik.errors.exam_form_link ? 'is-invalid' : ''}`}
                    value={formik.values.exam_form_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.exam_form_link && formik.touched.exam_form_link ? <div className="text-danger mt-1">{formik.errors.exam_form_link}</div> : null}
                </Form.Group>
              </Col>
              {/* Exam Mode */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="exam_mode">Exam Mode</Form.Label>
                  <Dropdown
                    options={ExamModeData}
                    values={[]}
                    closeOnSelect={false}
                    placeholder="Choose Exam Mode    "
                    keepSelectedInList={false}
                    multi={true}
                    searchable={false}
                    dropdownHandle={false}
                    value={formik.values.exam_mode}
                    onChange={(value) => formik.setFieldValue("exam_mode", value)}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
              </Col>
              {/* Description */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
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
  )
};

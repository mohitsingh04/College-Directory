import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import Dropdown from "react-dropdown-select";
import HandleUpdateFiles from "./HandleUpdateFiles";
import HandleUpdatePodcast from "./HandleUpdatePodcast";
import LoadingBar from 'react-top-loading-bar';
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";

export default function EditExam() {
  const navigate = useNavigate();
  const { objectId } = useParams();
  const loadingBarRef = useRef(null);
  const [exam, setExam] = useState(null);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoadingBar();
        setLoading(true);
        setHandlePermissionLoading(true);

        const [authResponse, statusResponse] = await Promise.all([
          API.get("/profile"),
          API.get("/status"),
        ]);

        setAuthUser(authResponse?.data?.data);

        const filteredStatus = statusResponse?.data?.filter(
          (item) => item.parent_status === "Category"
        );
        setStatus(filteredStatus);

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
        stopLoadingBar();
        setHandlePermissionLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const getExam = async () => {
      try {
        setLoading(true);
        startLoadingBar();
        const { data } = await API.get(`/exam/${objectId}`);
        setExam(data);
      } catch (error) {
        toast.error('Error fetching exam' + error.message);
      } finally {
        stopLoadingBar();
        setLoading(false);
      }
    };

    getExam();
  }, [objectId]);

  const initialValues = {
    name: exam?.name || "",
    short_name: exam?.short_name || "",
    description: exam?.description || "",
    upcoming_exam_date: exam?.upcoming_exam_date || "",
    result_date: exam?.result_date || "",
    youtube_link: exam?.youtube_link || "",
    application_form_date: exam?.application_form_date || "",
    exam_mode: exam?.exam_mode || "",
    application_form_link: exam?.application_form_link || "",
    exam_form_link: exam?.exam_form_link || "",
    status: exam?.status || "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Name can contain only alphabets and single spaces.').min(2, "Name must contain atleast 2 characters"),
    short_name: Yup.string().required("Short name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Short name can contain only alphabets and single spaces.').min(2, "Short name must contain atleast 2 characters"),
    upcoming_exam_date: Yup.string().required("Upcoming exam date is required."),
    result_date: Yup.string().required("Result date is required."),
    application_form_date: Yup.string().required("Application form date is required."),
    status: Yup.string().required("Status is required."),
  });

  const handleSubmit = async (values) => {
    try {
      startLoadingBar();
      const response = await API.put(`/exam/${objectId}`, values);
      if (response.data.message) {
        toast.success(response.data.message);
        navigate('/dashboard/exam');
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.error || "Bad Request");
        } else if (error.response.status === 404) {
          toast.error(error.response.status);
        } else if (error.response.status === 500) {
          toast.error("Internal server error, please try again later.");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      } else {
        toast.error(`Failed: ${error.message}`);
      }
    } finally {
      stopLoadingBar();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true
  });

  const ExamModeData = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
    { value: "Both", label: "Both" },
  ];

  useEffect(() => {
    document.title = "AJ | Edit Exam";
  }, []);

  const hasPermission = authUser?.permission?.some(
    (item) => item.value === "Update Exam"
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
          <h1 className="page-title fw-semibold fs-20 mb-0">Edit Exam</h1>
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
              <Breadcrumb.Item active>Edit</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      {loading
        ?
        <Skeleton height={500} />
        :
        <>
          <Card className="custom-card">
            <Card.Header>
              <h3 className="card-title">Edit Exam</h3>
              <div className="card-options ms-auto">
                <Link to={"/dashboard/exam"}>
                  <button type="button" className="btn btn-md btn-primary">
                    <i className="fe fe-arrow-left"></i> Back
                  </button>
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
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
                        placeholder="Upcoming Exam Date"
                        name="upcoming_exam_date"
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
                        placeholder="Result Date"
                        name="result_date"
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
                        closeOnSelect={false}
                        placeholder="Choose Exam Mode    "
                        keepSelectedInList={false}
                        multi={true}
                        searchable={false}
                        dropdownHandle={false}
                        values={exam?.exam_mode}
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
                        config={{
                          height: 300,
                        }}
                        id="description"
                        value={formik.values.description}
                        onBlur={(newContent) =>
                          formik.setFieldValue("description", newContent)
                        }
                      />
                    </Form.Group>
                  </Col>
                  {/* Status */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="status">Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Status</option>
                        {status.map((item) => (
                          <option key={item.uniqueId} value={item.status_name}>{item.status_name}</option>
                        ))}
                      </Form.Select>
                      {formik.errors.status && formik.touched.status ? <div className="text-danger mt-1">{formik.errors.status}</div> : null}
                    </Form.Group>
                  </Col>

                </Row>
                <Button type="submit">Update</Button>
              </Form>
            </Card.Body>
          </Card>
          <HandleUpdateFiles />
          <HandleUpdatePodcast />
        </>
      }
    </Fragment>
  );
}

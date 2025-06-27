import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../services/API";
import LoadingBar from 'react-top-loading-bar';

const validationSchema = Yup.object({
    parent_status: Yup.string().required("Parent Status is required."),
    status_name: Yup.string().required("Status Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Status name can contain only alphabets and single spaces.').min(2, "Status name must contain atleast 2 characters"),
});

const AddStatus = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
    const loadingBarRef = useRef(null);

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

    useEffect(() => {
        const getStatus = async () => {
            startLoadingBar();
            try {
                const { data } = await API.get("/status");
                setStatus(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getStatus();
    }, []);

    const initialValues = {
        parent_status: "",
        status_name: "",
        description: "",
    };

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        startLoadingBar();
        try {
            const response = await API.post("/status", values);
            
            if (response.data.message) {
                toast.success(response.data.message || "Added successfully", { id: toastId });
                navigate('/dashboard/status');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed", { id: toastId });
        } finally {
            stopLoadingBar();
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        document.title = "AJ | Add Status";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Create Status"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Add Status</h1>
                    <Breadcrumb className="mb-0">
                        <Breadcrumb.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/dashboard/status">Status</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title">Add Status</h3>
                    <Link to="/dashboard/status">
                        <Button variant="primary">
                            <i className="fe fe-arrow-left"></i> Back
                        </Button>
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="parent_status">Parent</Form.Label>
                                    {status.length > 0
                                        ?
                                        <>
                                            <select
                                                id="parent_status"
                                                name="parent_status"
                                                className={`form-control ${formik.touched.parent_status && formik.errors.parent_status
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                value={formik.values.parent_status}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="Uncategorized">Uncategorized</option>
                                                {status.map((item) => (
                                                    <option value={`${item.status_name}`}>{item.status_name}</option>
                                                ))}
                                            </select>
                                        </>
                                        :
                                        <>
                                            <select
                                                id="parent_status"
                                                name="parent_status"
                                                className={`form-control ${formik.touched.parent_status && formik.errors.parent_status
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                value={formik.values.parent_status}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="Uncategorized">Uncategorized</option>
                                            </select>
                                        </>
                                    }
                                    {formik.touched.parent_status && formik.errors.parent_status ? (
                                        <div className="text-danger">
                                            {formik.errors.parent_status}
                                        </div>
                                    ) : null}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="statusName">Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="statusName"
                                        placeholder="Enter status name"
                                        name="status_name"
                                        className={`form-control ${formik.touched.status_name && formik.errors.status_name
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={formik.values.status_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.status_name && formik.errors.status_name ? (
                                        <div className="text-danger">
                                            {formik.errors.status_name}
                                        </div>
                                    ) : null}
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="statusDescription">Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        rows={3}
                                        id="statusDescription"
                                        placeholder="Description..."
                                        className={`form-control ${formik.touched.description && formik.errors.description
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {/* <Editor
                                        apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                        onInit={(evt, editor) => (editorRef.current = editor)}
                                        onEditorChange={(content) => setDescription(content)}
                                        init={{
                                            height: 250,
                                            menubar: false,
                                            plugins: [
                                                "advlist autolink lists link image charmap preview anchor",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime media table code help wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | formatselect | bold italic forecolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | removeformat",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    /> */}
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
};

export default AddStatus;

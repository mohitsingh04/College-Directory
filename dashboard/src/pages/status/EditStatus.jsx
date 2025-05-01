import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../services/API";
import LoadingBar from 'react-top-loading-bar';

const validationSchema = Yup.object({
    parent_status: Yup.string().required("Parent Status is required."),
    status_name: Yup.string().required("Status Name is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Status name can contain only alphabets and single spaces.').min(2, "Status name must contain atleast 2 characters"),
});

const EditStatus = () => {
    const { objectId } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [statusData, setStatusData] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const loadingBarRef = useRef(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

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
        const getStatusData = async () => {
            try {
                startLoadingBar();
                const response = await API.get("/status");
                setStatusData(response.data)
            } catch (error) {
                console.log(error.message)
            } finally {
                stopLoadingBar();
            }
        };

        getStatusData();
    }, []);

    useEffect(() => {
        const getStatus = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get(`/status/${objectId}`);
                setStatus(data);
            } catch (error) {
                console.log(error.message)
            } finally {
                stopLoadingBar();
            }
        };

        getStatus();
    }, []);

    const initialValues = {
        parent_status: status[0]?.parent_status || "",
        status_name: status[0]?.status_name || "",
        description: status[0]?.description || "",
    }

    const handleSubmit = async (values) => {
        try {
            startLoadingBar();
            const response = await API.put(`/status/${objectId}`, values);
            if (response.data.message) {
                toast.success(response.data.message);
                navigate('/dashboard/status');
            } else {
                toast.success(response.data.error);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            stopLoadingBar();
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    useEffect(() => {
        document.title = "AJ | Edit Status";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Update Status"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Edit Status</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard/status'}>
                                    Status
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Edit</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">Edit Status</h3>
                    <div className="card-options ms-auto">
                        <Link to={"/dashboard/status"}>
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="parent_status">Parent</Form.Label>
                                    {statusData.length > 0
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
                                                {[...new Set(statusData.map((item) => item.parent_status))].map((status) => (
                                                    <option key={status} value={status}>{status}</option>
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
                                        placeholder="Name"
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
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-danger">
                                            {formik.errors.description}
                                        </div>
                                    ) : null}
                                    {/* <Editor
                                        apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        onChange={(e) => setDescription(editorRef.current.getContent())}
                                        onBlur={formik.handleBlur}
                                        init={{
                                            height: 250,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        initialValue={status[0]?.description}
                                    /> */}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary">
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    )
};

export default EditStatus;
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';
import { API } from "../../services/API";
import LoadingBar from 'react-top-loading-bar';
import JoditEditor from "jodit-react";
import ALLImages from "../../common/Imagesdata";

export default function AddCategory() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [PreviewLogo, setPreviewLogo] = useState(null);
    const [PreviewFeaturedImage, setPreviewFeaturedImage] = useState(null);
    const [category, setCategory] = useState([]);
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
        const getCategory = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get("/category");
                setCategory(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                stopLoadingBar();
            }
        };

        getCategory();
    }, []);

    const initialValues = {
        category_name: "",
        parent_category: "",
        logo: "",
        featured_image: "",
        description: "",
    }

    const validationSchema = Yup.object({
        category_name: Yup.string().required("Please select a category."),
        parent_category: Yup.string().required("Parent category is required.").matches(/^(?!.*\s{2})[A-Za-z\s]+$/, 'Parent category can contain only alphabets and single spaces.').min(2, "Parent category name must contain atleast 2 characters"),
    });

    const handleSubmit = async (values) => {
        try {
            startLoadingBar();
            const formData = new FormData();
            formData.append("category_name", values.category_name);
            formData.append("parent_category", values.parent_category);
            formData.append("logo", values.logo);
            formData.append("featured_image", values.featured_image);
            formData.append("description", values.description);

            const response = await API.post("/category", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/dashboard/category');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
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
    });

    const handleFileChange = (e, setFieldValue, fieldName, setPreview) => {
        const file = e.currentTarget.files[0];
        setFieldValue(fieldName, file);
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        document.title = "AJ | Add Category";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Create Category"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Add Category</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard/category'}>
                                    Category
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Add</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Card className="custom-card">
                <Card.Header>
                    <h3 className="card-title">Add Category</h3>
                    <div className="card-options ms-auto">
                        <Link to={"/dashboard/category"}>
                            <button type="button" className="btn btn-md btn-primary">
                                <i className="fe fe-arrow-left"></i> Back
                            </button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                        <Row>
                            {/* Category Name */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="category_name">Category Name</Form.Label>
                                    {category.length > 0
                                        ?
                                        <>
                                            <select
                                                id="category_name"
                                                name="category_name"
                                                className={`form-control ${formik.touched.category_name && formik.errors.category_name
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                value={formik.values.category_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="Uncategorized">Uncategorized</option>
                                                {category.map((item) => (
                                                    <option key={item.uniqueId} value={`${item.parent_category}`}>
                                                        {item.parent_category}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                        :
                                        <>
                                            <select
                                                id="category_name"
                                                name="category_name"
                                                className={`form-control ${formik.touched.category_name && formik.errors.category_name
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                value={formik.values.category_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="Uncategorized">Uncategorized</option>
                                            </select>
                                        </>
                                    }
                                    {formik.touched.category_name && formik.errors.category_name ? (
                                        <div className="text-danger">
                                            {formik.errors.category_name}
                                        </div>
                                    ) : null}
                                </Form.Group>
                            </Col>
                            {/* Parent Category */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="parent_category">Parent Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="parent_category"
                                        placeholder="Parent Category"
                                        name="parent_category"
                                        className={`form-control ${formik.touched.parent_category && formik.errors.parent_category ? 'is-invalid' : ''}`}
                                        value={formik.values.parent_category}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.parent_category && formik.touched.parent_category ? <div className="text-danger mt-1">{formik.errors.parent_category}</div> : null}
                                </Form.Group>
                            </Col>
                            {/* Description */}
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <JoditEditor
                                        ref={editorRef}
                                        config={{
                                            height: 300,
                                        }}
                                        value={formik.values.description}
                                        onBlur={(newContent) =>
                                            setFieldValue("description", newContent)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            {/* Logo */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="logo">Logo</Form.Label>
                                    <Form.Control
                                        type="file"
                                        id="logo"
                                        name="logo"
                                        className={`form-control`}
                                        onChange={(e) => handleFileChange(e, formik.setFieldValue, "logo", setPreviewLogo)}
                                        onBlur={formik.handleBlur}
                                    />
                                    {/* {PreviewLogo && <img src={PreviewLogo} alt="Logo Preview" className="mt-2" />} */}
                                    {PreviewLogo
                                        ? <img src={PreviewLogo} width={100} height={100} alt="Logo Preview" className="mt-2 shadow-sm" />
                                        : <img src={ALLImages('noImage')} width={100} height={100} alt="Logo Preview" className="mt-2 shadow-sm" />
                                    }
                                </Form.Group>
                            </Col>
                            {/* Featured Image */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="featured_image">Featured Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        id="featured_image"
                                        name="featured_image"
                                        className={`form-control`}
                                        onChange={(e) => handleFileChange(e, formik.setFieldValue, "featured_image", setPreviewFeaturedImage)}
                                        onBlur={formik.handleBlur}
                                    />
                                    {/* {PreviewFeaturedImage && <img src={PreviewFeaturedImage} alt="Featured Image Preview" className="mt-2" style={{ maxWidth: "100px" }} />} */}
                                    {PreviewFeaturedImage
                                        ? <img src={PreviewFeaturedImage} width={120} height={80} alt="Featured image preview" className="mt-2 shadow-sm" />
                                        : <img src={ALLImages('noImage')} width={120} height={80} alt="Featured image preview" className="mt-2 shadow-sm" />
                                    }
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button type="submit">Add Category</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Fragment>
    );
}

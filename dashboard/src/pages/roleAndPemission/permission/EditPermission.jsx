import React, { Fragment, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Card, Form, Breadcrumb, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { Editor } from '@tinymce/tinymce-react';

export default function EditPermission() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [description, setDescription] = useState("");

  const initialValues = {
    name: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Permission Name is required."),
  });

  const handleSubmit = (values) => {
    try {
      values = { ...values, "description": description }
      console.log(values)
      toast.success("Cool");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  });

  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div className="">
          <h1 className="page-title fw-semibold fs-20 mb-0">Edit Permission</h1>
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
              <Breadcrumb.Item active>Edit</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">Edit Permission</h3>
          <div className="card-options ms-auto">
            <Link to={"/dashboard/role-and-permission"}>
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
                  <Form.Label htmlFor="permissionName">Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="permissionName"
                    placeholder="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.name && formik.touched.name ? <div className="text-danger mt-1">{formik.errors.name}</div> : null}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="userName">Description</Form.Label>
                  <Editor
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
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit">Update</Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

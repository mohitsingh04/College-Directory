import React, { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import { getEditorConfig } from "../../../../services/context/editorConfig";

const validationSchema = Yup.object({
  process: Yup.string()
    .required("Description is required.")
});

export default function AddAdmissionProcess({ setAdmissionProcess, setToggleAdmissionProcessPage }) {
  const navigate = useNavigate();
  const { uniqueId } = useParams();
  const editorConfig = useMemo(() => getEditorConfig(), []);

  const initialValues = {
    propertyId: uniqueId,
    process: "",
  }

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    try {
      const response = await API.post(`/admission-process`, values);

      if (response.status === 200) {
        toast.success(response.data.message || "Added successfully", { id: toastId });
        const newAdmissionProcess = await API.get('/admission-process');
        const filtered = newAdmissionProcess.data.filter((admission) => admission.propertyId === Number(uniqueId));
        setAdmissionProcess(filtered);
        setToggleAdmissionProcessPage(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed", { id: toastId });
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Fragment>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          {/* Admission Process */}
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Admission Process</Form.Label>
              <JoditEditor
                config={editorConfig}
                value={formik.values.process}
                onBlur={(newContent) =>
                  formik.setFieldValue("process", newContent)
                }
              />
              {formik.touched.process && formik.errors.process ? (
                <div className="text-red-500 mt-1">{formik.errors.process}</div>
              ) : null}
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Adding..." : "Add"}
        </Button>
      </Form>
    </Fragment>
  );
}

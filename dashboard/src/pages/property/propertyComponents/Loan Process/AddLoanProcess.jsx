import React, { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";

const validationSchema = Yup.object({
  process: Yup.string()
    .required("Description is required.")
});

export default function AddLoanProcess({ setLoanProcess, setToggleLoanProcessPage }) {
  const { uniqueId } = useParams();

  const initialValues = {
    propertyId: uniqueId,
    process: "",
  }

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    try {
      const response = await API.post(`/loan-process`, values);

      if (response.status === 200) {
        toast.success(response.data.message || "Added successfully", { id: toastId });
        const newLoanProcess = await API.get('/loan-process');
        const filtered = newLoanProcess.data.filter((loan) => loan.propertyId === Number(uniqueId));
        setLoanProcess(filtered);
        setToggleLoanProcessPage(true);
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
          {/* Loan Process */}
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Process</Form.Label>
              <JoditEditor
                config={{
                  height: 300,
                }}
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

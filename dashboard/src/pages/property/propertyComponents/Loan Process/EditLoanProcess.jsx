import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { API } from "../../../../services/API";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import { getEditorConfig } from "../../../../services/context/editorConfig";

const validationSchema = Yup.object({
  process: Yup.string()
    .required("Description is required.")
});

export default function EditLoanProcess({ setLoanProcess, setToggleLoanProcessPage }) {
  const navigate = useNavigate();
  const { uniqueId } = useParams();
  const [loanProcessData, setLoanProcessData] = useState("");
  const [loading, setLoading] = useState(true);
  const editorConfig = useMemo(() => getEditorConfig(), []);

  useEffect(() => {
    const fetchLoanProcess = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/loan-process`);
        const filteredLoanProcess = response.data.filter((process) => process.propertyId === Number(uniqueId));
        setLoanProcessData(filteredLoanProcess);
      } catch (error) {
        console.error('Error fetching loan process:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanProcess();
  }, [uniqueId]);

  const initialValues = {
    propertyId: uniqueId,
    process: loanProcessData[0]?.process || "",
  }

  const handleSubmit = async (values) => {
    const toastId = toast.loading("Updating...");
    try {
      const response = await API.put(`/loan-process/${loanProcessData[0]?.uniqueId}`, values);

      if (response.status === 200) {
        toast.success(response.data.message || "Updated successfully", { id: toastId });
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
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true
  });

  return (
    <Fragment>
      {loading
        ?
        <Skeleton height={300} />
        :
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            {/* Loan Process */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Loan Process</Form.Label>
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
            {formik.isSubmitting ? "Updating..." : "Update"}
          </Button>
        </Form>
      }
    </Fragment>
  );
}

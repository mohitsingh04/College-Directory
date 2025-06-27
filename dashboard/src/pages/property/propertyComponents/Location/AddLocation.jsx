import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import { API } from "../../../../services/API";

export default function AddLocation({ setLocation, setToggleLocationPage }) {
    const { uniqueId } = useParams();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countryRes, stateRes, cityRes] = await Promise.all([
                    API.get("/fetch-country"),
                    API.get("/fetch-states"),
                    API.get("/fetch-city")
                ]);
                setCountries(countryRes?.data);
                setStates(stateRes?.data);
                setCities(cityRes?.data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchData();
    }, []);

    const initialValues = {
        propertyId: uniqueId,
        address: "",
        pincode: "",
        country: "",
        city: "",
        state: "",
    };

    const validationSchema = Yup.object({
        address: Yup.string().required("Provide a valid address."),
        pincode: Yup.string().required("Provide a valid pincode."),
        country: Yup.string().required("Provide a valid country."),
        city: Yup.string().required("Provide a valid city."),
        state: Yup.string().required("Provide a valid state."),
    });

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const response = await API.post(`/location`, values);
            if (response.status === 200) {
                toast.success(response.data.message || "Updated successfully", { id: toastId });
                const newLocation = await API.get('/location');
                const filtered = newLocation.data.filter((loc) => loc.propertyId === Number(uniqueId));
                setLocation(filtered);
                setToggleLocationPage(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const filteredStates = states.filter((item) => item.country_name === formik.values.country);
    const filteredCities = cities.filter((item) => item.state_name === formik.values.state);

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Address..."
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.address && formik.errors.address ? 'is-invalid' : ''}
                        />
                        {formik.touched.address && formik.errors.address && (
                            <div className="text-danger">{formik.errors.address}</div>
                        )}
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                            type="text"
                            name="pincode"
                            placeholder="Pincode..."
                            value={formik.values.pincode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.pincode && formik.errors.pincode ? 'is-invalid' : ''}
                        />
                        {formik.touched.pincode && formik.errors.pincode && (
                            <div className="text-danger">{formik.errors.pincode}</div>
                        )}
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                            name="country"
                            value={formik.values.country}
                            onChange={(e) => {
                                formik.setFieldValue("country", e.target.value);
                                formik.setFieldValue("state", "");
                                formik.setFieldValue("city", "");
                            }}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select Country</option>
                            {countries.map((item) => (
                                <option key={item.id} value={item.country_name}>{item.country_name}</option>
                            ))}
                        </Form.Select>
                        {formik.touched.country && formik.errors.country && (
                            <div className="text-danger">{formik.errors.country}</div>
                        )}
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Select
                            name="state"
                            value={formik.values.state}
                            onChange={(e) => {
                                formik.setFieldValue("state", e.target.value);
                                formik.setFieldValue("city", "");
                            }}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select State</option>
                            {filteredStates.map((item) => (
                                <option key={item.id} value={item.name}>{item.name}</option>
                            ))}
                        </Form.Select>
                        {formik.touched.state && formik.errors.state && (
                            <div className="text-danger">{formik.errors.state}</div>
                        )}
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Select
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">Select City</option>
                            {filteredCities.map((item) => (
                                <option key={item.id} value={item.name}>{item.name}</option>
                            ))}
                        </Form.Select>
                        {formik.touched.city && formik.errors.city && (
                            <div className="text-danger">{formik.errors.city}</div>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Adding..." : "Add"}
            </Button>
        </Form>
    );
}

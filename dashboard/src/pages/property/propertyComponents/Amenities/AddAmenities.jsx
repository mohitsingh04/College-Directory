import React, { Fragment, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../../../services/API";

const amenitiesData = {
    "Mandatory": ["Parking", "WiFi", "CCTV Surveillance", "Security Guards"],
    "Basic Facilities": ["Power Backup", "Drinking Water", "First Aid", "Elevator"],
    "Academic Facilities": ["Library", "Computer Lab", "Science Lab", "Smart Classrooms"],
    "Outdoor Facilities": ["Sports Ground", "Basketball Court", "Volleyball Court", "Garden"],
    "Hostel Facilities": ["Boys Hostel", "Girls Hostel", "Mess", "Laundry"],
    "Food and Drink": ["Cafeteria", "Food Court", "Vending Machines"],
    "Common Areas": ["Auditorium", "Seminar Hall", "Reading Room", "Lounge"],
    "Transport": ["College Bus", "Bike Parking", "Car Parking"],
    "Health & Wellness": ["Medical Room", "Counseling Center", "Gym"],
    "Extra Services": ["ATM", "Book Store", "Stationery Shop", "Photocopy Service"]
};

export default function AddAmenities({ setAmenitiesData, setToggleAmenitiesPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("Mandatory");
    const [parkingType, setParkingType] = useState([]);
    const [wifiType, setWifiType] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [amenities, setAmenities] = useState(() =>
        Object.fromEntries(
            Object.entries(amenitiesData).map(([category, items]) => [
                category,
                Object.fromEntries(items.map((amenity) => [amenity, false]))
            ])
        )
    );

    const handleSelection = (category, amenity, value) => {
        setAmenities((prev) => ({
            ...prev,
            [category]: { ...prev[category], [amenity]: value },
        }));

        if (amenity === "Parking" && !value) setParkingType([]);
        if (amenity === "WiFi" && !value) setWifiType([]);
    };

    const toggleSubOption = (type, value) => {
        const setType = type === "WiFi" ? setWifiType : setParkingType;
        const current = type === "WiFi" ? wifiType : parkingType;
        if (current.includes(value)) {
            setType(current.filter((item) => item !== value));
        } else {
            setType([...current, value]);
        }
    };

    const formatAmenitiesForSubmission = () => {
        const formatted = {};
        Object.entries(amenities).forEach(([category, items]) => {
            const selected = Object.entries(items).filter(([_, v]) => v === true).map(([k]) => {
                if (k === "WiFi" && wifiType.length) return { [k]: wifiType };
                if (k === "Parking" && parkingType.length) return { [k]: parkingType };
                return { [k]: true };
            });
            if (selected.length) formatted[category] = selected;
        });
        return formatted;
    };

    const validateAmenities = () => {
        const flat = Object.values(amenities).flatMap((item) => Object.values(item));
        return flat.includes(true);
    };

    const formik = useFormik({
        initialValues: { propertyId: uniqueId || "" },
        onSubmit: async (values) => {
            if (isSubmitting) return;
            if (!validateAmenities()) {
                toast.error("Please select at least one amenity.");
                return;
            }
            setIsSubmitting(true);

            const toastId = toast.loading("Updating...");
            try {
                const payload = {
                    propertyId: values.propertyId,
                    selectedAmenities: [formatAmenitiesForSubmission()],
                };
                const response = await API.post('/amenities', payload);
                if (response.status === 200) {
                    toast.success(response.data.message || "Added successfully", { id: toastId });
                    const newAmenitiesData = await API.get('/amenities');
                    const filtered = newAmenitiesData.data.filter((ameneties) => ameneties.propertyId === Number(uniqueId));
                    setAmenitiesData(filtered);
                    setToggleAmenitiesPage(true);
                }
            } catch (error) {
                toast.error(error.response?.data?.error || "Update failed", { id: toastId });
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const renderAmenityItem = (category, amenity) => {
        const isSelected = amenities[category][amenity];
        return (
            <div key={amenity} className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">{amenity}</span>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => handleSelection(category, amenity, false)} className={`px-4 py-2 rounded-md ${!isSelected ? "bg-red-500 text-white" : "border border-gray-300"}`}>No</button>
                        <button type="button" onClick={() => handleSelection(category, amenity, true)} className={`px-4 py-2 rounded-md ${isSelected ? "bg-green-500 text-white" : "border border-gray-300"}`}>Yes</button>
                    </div>
                </div>

                {amenity === "Parking" && isSelected && (
                    <div className="ml-8 mt-2 flex gap-2">
                        {['Indoor', 'Outdoor', 'Valet'].map((option) => (
                            <label key={option} className="inline-flex items-center">
                                <input type="checkbox" className="mr-2" checked={parkingType.includes(option)} onChange={() => toggleSubOption("Parking", option)} />{option}
                            </label>
                        ))}
                    </div>
                )}

                {amenity === "WiFi" && isSelected && (
                    <div className="ml-8 mt-2 flex gap-2">
                        {['Free', 'Paid'].map((option) => (
                            <label key={option} className="inline-flex items-center">
                                <input type="checkbox" className="mr-2" checked={wifiType.includes(option)} onChange={() => toggleSubOption("WiFi", option)} />{option}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit} className="max-w-6xl mx-auto">
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-xl font-semibold mb-4">Property Amenities</Form.Label>
                            <div className="flex w-full bg-white shadow rounded-lg overflow-hidden">
                                <div className="w-1/3 border-r border-gray-200">
                                    {Object.keys(amenitiesData).map((category) => (
                                        <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`block w-full text-left p-4 ${selectedCategory === category ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}>{category}</button>
                                    ))}
                                </div>
                                <div className="w-2/3 p-6">
                                    <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>
                                    <div className="space-y-4">
                                        {amenitiesData[selectedCategory].map((amenity) => renderAmenityItem(selectedCategory, amenity))}
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mt-3 flex justify-end">
                    <Button type="submit" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Adding..." : "Add"}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
}

import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../../../services/API";
import Skeleton from "react-loading-skeleton";

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

export default function EditAmenities({ setAmenitiesData, setToggleAmenitiesPage }) {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("Mandatory");
    const [parkingType, setParkingType] = useState([]);
    const [wifiType, setWifiType] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amenitiesListData, setAmenitiesListData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const toggleOption = (value, setter) => {
        setter((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    useEffect(() => {
        const fetchAmenitiesData = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/amenities`);
                const filtered = response.data.filter(
                    (a) => a.propertyId === Number(uniqueId)
                );
                setAmenitiesListData(filtered);

                if (filtered.length > 0) {
                    const fetched = filtered[0].selectedAmenities?.[0] || {};
                    const newAmenities = {};

                    Object.entries(amenitiesData).forEach(([cat, items]) => {
                        newAmenities[cat] = {};
                        items.forEach((item) => {
                            const match = fetched[cat]?.find((e) =>
                                typeof e === "object" && e[item] !== undefined ? true : e === item
                            );
                            newAmenities[cat][item] = !!match;

                            if (item === "Parking" && typeof match === "object") {
                                const value = match[item];
                                setParkingType(Array.isArray(value) ? value : [value]);
                            }

                            if (item === "WiFi" && typeof match === "object") {
                                const value = match[item];
                                setWifiType(Array.isArray(value) ? value : [value]);
                            }
                        });
                    });

                    setAmenities(newAmenities);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAmenitiesData();
    }, [uniqueId]);

    const formatAmenitiesForSubmission = () => {
        const formatted = {};
        Object.entries(amenities).forEach(([category, items]) => {
            const selected = [];
            Object.entries(items).forEach(([key, val]) => {
                if (val) {
                    if (key === "WiFi" && wifiType.length > 0) {
                        selected.push({ [key]: wifiType });
                    } else if (key === "Parking" && parkingType.length > 0) {
                        selected.push({ [key]: parkingType });
                    } else {
                        selected.push({ [key]: true });
                    }
                }
            });
            if (selected.length > 0) formatted[category] = selected;
        });
        return [formatted];
    };

    const formik = useFormik({
        initialValues: {
            propertyId: uniqueId || "",
        },
        onSubmit: async (values) => {
            const formatted = formatAmenitiesForSubmission();
            const hasSelection = Object.values(formatted[0]).some((a) => a.length > 0);
            if (!hasSelection) {
                toast.error("Please select at least one amenity.");
                return;
            }

            if (isSubmitting) return;
            setIsSubmitting(true);

            const toastId = toast.loading("Updating..."); // moved here

            try {
                const payload = {
                    propertyId: values.propertyId,
                    selectedAmenities: formatted,
                };
                const res = await API.put(`/amenities/${amenitiesListData[0]?.uniqueId}`, payload);
                if (res.status === 200) {
                    toast.success(res.data.message || "Updated successfully", { id: toastId });
                    const newAmenitiesData = await API.get('/amenities');
                    const filtered = newAmenitiesData.data.filter(
                        (ameneties) => ameneties.propertyId === Number(uniqueId)
                    );
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
            <div key={amenity}>
                <div className="d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted">{amenity}</span>
                    <div className="d-flex gap-3">
                        <button
                            type="button"
                            onClick={() => handleSelection(category, amenity, false)}
                            className={`px-4 py-2 ${!isSelected ? "bg-danger text-white" : "border border-dark"}`}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelection(category, amenity, true)}
                            className={`px-4 py-2 ${isSelected ? "bg-success text-white" : "border border-dark"}`}
                        >
                            Yes
                        </button>
                    </div>
                </div>

                {category === "Mandatory" && amenity === "Parking" && isSelected && (
                    <div className="ms-4 mt-2">
                        {["Indoor", "Outdoor", "Valet"].map((type) => (
                            <label key={type} className="me-3">
                                <input
                                    type="checkbox"
                                    checked={parkingType.includes(type)}
                                    onChange={() => toggleOption(type, setParkingType)}
                                />{" "}
                                {type}
                            </label>
                        ))}
                    </div>
                )}

                {category === "Mandatory" && amenity === "WiFi" && isSelected && (
                    <div className="ms-4 mt-2">
                        {["Free", "Paid"].map((type) => (
                            <label key={type} className="me-3">
                                <input
                                    type="checkbox"
                                    checked={wifiType.includes(type)}
                                    onChange={() => toggleOption(type, setWifiType)}
                                />{" "}
                                {type}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={300} />
            ) : (
                <Form onSubmit={formik.handleSubmit} className="max-w-6xl mx-auto p-4">
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-xl font-semibold mb-4">Property Amenities</Form.Label>
                                <div className="flex w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="w-1/3 border-r border-gray-200">
                                        {Object.keys(amenitiesData).map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`block w-full text-left p-4 ${selectedCategory === cat
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {cat} ({amenitiesData[cat].length})
                                            </button>
                                        ))}
                                    </div>
                                    <div className="w-2/3 p-6">
                                        <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>
                                        <div className="space-y-4">
                                            {amenitiesData[selectedCategory].map((amenity) =>
                                                renderAmenityItem(selectedCategory, amenity)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {isSubmitting ? "Saving..." : "Save Amenities"}
                        </Button>
                    </div>
                </Form>
            )}
        </Fragment>
    );
}

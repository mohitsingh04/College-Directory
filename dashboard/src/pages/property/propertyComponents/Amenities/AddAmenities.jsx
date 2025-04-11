import React, { Fragment, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { API } from "../../../../services/API";

const amenitiesData = {
    "Mandatory": ["Air Conditioning", "Laundry", "Newspaper", "Parking"],
    "Basic Facilities": ["WiFi", "Power Backup", "Elevator"],
    "General Services": ["Room Service", "Security", "Concierge"],
    "Outdoor Activities and Sports": ["Swimming Pool", "Gym", "Tennis Court"],
    "Common Area": ["Lounge", "Terrace", "Garden"],
    "Food and Drink": ["Restaurant", "Cafe"],
};

export default function AddAmenities() {
    const { uniqueId } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("Mandatory");
    const [parkingType, setParkingType] = useState("");
    const [wifiType, setWifiType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [amenities, setAmenities] = useState(() =>
        Object.fromEntries(
            Object.entries(amenitiesData).map(([category, items]) => [
                category,
                Object.fromEntries(items.map((amenity) => [amenity, null]))
            ])
        )
    );

    const handleSelection = (category, amenity, value) => {
        setAmenities((prev) => ({
            ...prev,
            [category]: { ...prev[category], [amenity]: value },
        }));

        if (amenity === "Parking" && !value) {
            setParkingType("");
        }
        if (amenity === "WiFi" && !value) {
            setWifiType("");
        }
    };

    const formatAmenitiesForSubmission = () => {
        const formattedAmenities = {};

        Object.entries(amenities).forEach(([category, amenityList]) => {
            const selected = Object.entries(amenityList)
                .filter(([_, value]) => value === true)
                .map(([amenity]) => {
                    if (amenity === "WiFi" && wifiType) {
                        return { [amenity]: wifiType };
                    } else if (amenity === "Parking" && parkingType) {
                        return { [amenity]: parkingType };
                    }
                    return { [amenity]: true };
                });

            if (selected.length > 0) {
                formattedAmenities[category] = selected;
            }
        });

        return [formattedAmenities];
    };

    const formik = useFormik({
        initialValues: {
            propertyId: uniqueId || "",
        },
        onSubmit: async (values) => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            try {
                const payload = {
                    propertyId: values.propertyId,
                    selectedAmenities: formatAmenitiesForSubmission(),
                };

                console.log(payload)
                const response = await API.post('/amenities', payload);

                if (response.status === 200) {
                    toast.success("Amenities added successfully!");
                    window.location.reload();
                }
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    if (status === 400) {
                        toast.error(error.response.data.error || "Bad Request");
                    } else if (status === 404) {
                        toast.error("Resource not found");
                    } else {
                        toast.error("An error occurred while saving amenities");
                    }
                } else {
                    toast.error("Network error occurred");
                }
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const renderAmenityItem = (category, amenity) => {
        const isSelected = amenities[category][amenity];

        return (
            <div key={amenity} className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-700">{amenity}</span>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => handleSelection(category, amenity, false)}
                            className={`px-4 py-2 rounded-md transition-colors ${isSelected === false
                                ? "bg-red-500 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            No
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelection(category, amenity, true)}
                            className={`px-4 py-2 rounded-md transition-colors ${isSelected === true
                                ? "bg-green-500 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            Yes
                        </button>
                    </div>
                </div>

                {/* Show Parking Type selection within Mandatory section */}
                {category === "Mandatory" && amenity === "Parking" && isSelected && (
                    <div className="ml-8 mt-2">
                        <select
                            value={parkingType}
                            onChange={(e) => setParkingType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Parking Type</option>
                            <option value="Indoor">Indoor</option>
                            <option value="Outdoor">Outdoor</option>
                            <option value="Valet">Valet</option>
                        </select>
                    </div>
                )}

                {/* Show WiFi Type selection within Basic Facilities section */}
                {category === "Basic Facilities" && amenity === "WiFi" && isSelected && (
                    <div className="ml-8 mt-2">
                        <select
                            value={wifiType}
                            onChange={(e) => setWifiType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select WiFi Type</option>
                            <option value="Free">Free</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit} className="max-w-6xl mx-auto p-4">
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-xl font-semibold mb-4">Property Amenities</Form.Label>
                            <div className="flex w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-1/3 border-r border-gray-200">
                                    {Object.keys(amenitiesData).map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setSelectedCategory(category)}
                                            className={`block w-full text-left p-4 transition-colors ${selectedCategory === category
                                                ? "bg-blue-600 text-white"
                                                : "hover:bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            {category} ({amenitiesData[category].length})
                                        </button>
                                    ))}
                                </div>

                                {/* Amenities Selection */}
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
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Amenities"}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
}
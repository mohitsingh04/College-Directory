import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function Hostel() {
    const { collegeId } = useParams();
    const [propertyHostel, setPropertyHostel] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchPropertyHostelData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/hostel");
                const filteredPropertyHostel = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyHostel(filteredPropertyHostel);
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false);
            }
        };

        const fetchPropertyData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-property-list");
                const filteredProperty = response?.data?.filter((property) => property?.uniqueId === Number(collegeId));
                setProperty(filteredProperty);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyHostelData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>{property[0]?.property_name} Hostel Details</h2>
                    </Card.Header>
                    <Card.Body>
                        <div className="p-4">
                            {/* Boys Hostel Section */}
                            <div className="mb-6 border-b pb-4">
                                <h5 className="text-lg font-semibold text-gray-800">
                                    Boys Hostel Fees: <span className="font-normal">{propertyHostel[0]?.boys_hostel_fees}</span>
                                </h5>
                                <h6 className="text-md font-medium text-gray-700 mt-2">Boys Hostel Details:</h6>
                                <div className="mt-2 text-gray-600 text-sm">
                                    {propertyHostel[0]?.boys_hostel_description.length >= 1500 ? (
                                        <>
                                            <p
                                                className="leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpandedBoysDetails
                                                        ? propertyHostel[0]?.boys_hostel_description
                                                        : propertyHostel[0]?.boys_hostel_description.substring(0, 1500) + "...",
                                                }}
                                            />
                                            <button
                                                onClick={toggleReadMoreBoysDetails}
                                                className="text-blue-600 font-medium hover:underline mt-2"
                                            >
                                                {isExpandedBoysDetails ? "Read Less" : "Read More"}
                                            </button>
                                        </>
                                    ) : (
                                        <p
                                            className="leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: propertyHostel[0]?.boys_hostel_description,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Girls Hostel Section */}
                            <div>
                                <h5 className="text-lg font-semibold text-gray-800">
                                    Girls Hostel Fees: <span className="font-normal">{propertyHostel[0]?.girls_hostel_fees}</span>
                                </h5>
                                <h6 className="text-md font-medium text-gray-700 mt-2">Girls Hostel Details:</h6>
                                <div className="mt-2 text-gray-600 text-sm">
                                    {propertyHostel[0]?.girls_hostel_description.length >= 1500 ? (
                                        <>
                                            <p
                                                className="leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpandedGirlsDetails
                                                        ? propertyHostel[0]?.girls_hostel_description
                                                        : propertyHostel[0]?.girls_hostel_description.substring(0, 1500) + "...",
                                                }}
                                            />
                                            <button
                                                onClick={toggleReadMoreGirlsDetails}
                                                className="text-blue-600 font-medium hover:underline mt-2"
                                            >
                                                {isExpandedGirlsDetails ? "Read Less" : "Read More"}
                                            </button>
                                        </>
                                    ) : (
                                        <p
                                            className="leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: propertyHostel[0]?.girls_hostel_description,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
};

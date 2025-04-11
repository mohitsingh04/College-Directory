import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default function BasicInfo() {
    const { collegeId } = useParams();
    const [propertyOtherDetails, setPropertyOtherDetails] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpandedShortDescription, setIsExpandedShortDescription] = useState(false);
    const [isExpandedFullDescription, setIsExpandedFullDescription] = useState(false);

    const toggleReadMoreShortDescription = () => {
        setIsExpandedShortDescription(!isExpandedShortDescription);
    };

    const toggleReadMoreFullDescription = () => {
        setIsExpandedFullDescription(!isExpandedFullDescription);
    };

    useEffect(() => {
        const fetchPropertyOtherDetailsData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/otherBasicDetails");
                const filteredProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyOtherDetails(filteredProperty);
            } catch (error) {
                console.log(error.message);
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

        fetchPropertyOtherDetailsData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>Information</h2>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            {propertyOtherDetails[0]?.short_description.length >= 1500
                                ?
                                <>
                                    <p
                                        style={{ fontSize: "16px" }}
                                        dangerouslySetInnerHTML={{
                                            __html: isExpandedShortDescription
                                                ? propertyOtherDetails[0]?.short_description
                                                : propertyOtherDetails[0]?.short_description.substring(0, 1500) + "...",
                                        }}
                                    />
                                    <button onClick={toggleReadMoreShortDescription} className="text-blue-700 underline">
                                        {isExpandedShortDescription ? "Read Less" : "Read More"}
                                    </button>
                                </>
                                :
                                <p
                                    style={{ fontSize: "16px" }}
                                    dangerouslySetInnerHTML={{
                                        __html: propertyOtherDetails[0]?.short_description
                                    }}
                                />
                            }

                            <h5>About {property[0]?.property_name}</h5>
                            {propertyOtherDetails[0]?.full_description.length >= 1500
                                ?
                                <>
                                    <p
                                        style={{ fontSize: "16px" }}
                                        dangerouslySetInnerHTML={{
                                            __html: isExpandedShortDescription
                                                ? propertyOtherDetails[0]?.full_description
                                                : propertyOtherDetails[0]?.full_description.substring(0, 1500) + "...",
                                        }}
                                    />
                                    <button onClick={toggleReadMoreShortDescription} className="text-blue-700 underline">
                                        {isExpandedShortDescription ? "Read Less" : "Read More"}
                                    </button>
                                </>
                                :
                                <p
                                    style={{ fontSize: "16px" }}
                                    dangerouslySetInnerHTML={{
                                        __html: propertyOtherDetails[0]?.full_description
                                    }}
                                />
                            }
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
}

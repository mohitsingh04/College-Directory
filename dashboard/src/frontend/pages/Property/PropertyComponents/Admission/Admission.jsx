import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function Admission() {
    const { collegeId } = useParams();
    const [propertyAdmission, setPropertyAdmission] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyAdmissionData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/otherBasicDetails");
                const filteredProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyAdmission(filteredProperty);
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

        fetchPropertyAdmissionData();
        fetchPropertyData();
    }, []);

    return (
        <div>
            <Fragment>
                {loading ? (
                    <Skeleton height={250} className="mb-3" />
                ) : (
                    <Card>
                        <Card.Header>
                            <h2>{property[0]?.property_name} Admission Process {new Date().getFullYear()}</h2>
                        </Card.Header>
                        <Card.Body>
                            {/* {propertyAdmission[0]?.admission_process.length >= 1500
                            ?
                            <>
                                <p
                                    style={{ fontSize: "16px" }}
                                    dangerouslySetInnerHTML={{
                                        __html: isExpandedShortDescription
                                            ? propertyAdmission[0]?.admission_process
                                            : propertyAdmission[0]?.admission_process.substring(0, 1500) + "...",
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
                                    __html: propertyAdmission[0]?.admission_process
                                }}
                            />
                        } */}
                            <p
                                style={{ fontSize: "16px" }}
                                dangerouslySetInnerHTML={{
                                    __html: propertyAdmission[0]?.admission_process
                                }}
                            />
                        </Card.Body>
                    </Card>
                )}
            </Fragment>
        </div>
    )
}

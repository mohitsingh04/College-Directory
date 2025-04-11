import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function Scholarship() {
    const { collegeId } = useParams();
    const [propertyScholarship, setPropertyScholarship] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyScholarshipData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/scholarship");
                const filteredScholarshipProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyScholarship(filteredScholarshipProperty);
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

        fetchPropertyScholarshipData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>{property[0]?.property_name} Scholarship {new Date().getFullYear()}</h2>
                    </Card.Header>
                    <Card.Body>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: propertyScholarship[0]?.scholarship
                            }}
                        />
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
};

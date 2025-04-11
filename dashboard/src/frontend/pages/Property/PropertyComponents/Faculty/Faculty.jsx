import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function Faculty() {
    const { collegeId } = useParams();
    const [propertyFaculty, setPropertyFaculty] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyFacultyData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/faculty");
                const filteredFacultyProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyFaculty(filteredFacultyProperty);
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

        fetchPropertyFacultyData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>{property[0]?.property_name} Faculty Details</h2>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {propertyFaculty.map((faculty, index) => (
                                <Col md={3}>
                                    <div key={index}>
                                        <div className="flex flex-col items-center border rounded-lg shadow-sm p-4 w-64">
                                            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                                                <img width="25" height="25" src="https://img.icons8.com/pastel-glyph/100/person-male--v3.png" alt="person-male--v3" />
                                            </div>
                                            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded mt-2">
                                                {faculty?.designation}
                                            </span>
                                            <h2 className="text-lg font-bold text-center mt-2">
                                                {faculty?.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm">{faculty?.department}</p>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
};

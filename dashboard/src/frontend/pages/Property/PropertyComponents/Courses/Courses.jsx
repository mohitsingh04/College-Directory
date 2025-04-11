import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default function Courses() {
    const { collegeId } = useParams();
    const [propertyCourses, setPropertyCourses] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyCourseData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/property-course");
                const filteredPropertyCourse = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyCourses(filteredPropertyCourse);
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

        fetchPropertyCourseData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>{property[0]?.property_name} Popular Courses</h2>
                    </Card.Header>
                    <Card.Body>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Fees</th>
                                    <th>Eligibilty</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {propertyCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td>{course?.name && course.name[0] && course.name[0].value}</td>
                                        <td>{course?.course_fees}</td>
                                        <td>{course?.eligibility}</td>
                                        <td>{course?.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
}

import React, { useEffect, useState } from "react";
import { API } from "../../../../services/API";

export default function ViewCourse({ courseUniqueId }) {
    const [courseDetails, setCourseDetails] = useState(null);
    const [propertyCourse, setPropertyCourse] = useState(null);
    const [showFullEligibility, setShowFullEligibility] = useState(false);

    const fetchCourseAndPropertyCourse = async () => {
        try {
            const [courseRes, propertyCourseRes] = await Promise.all([
                API.get('/course'),
                API.get(`/property-course/${courseUniqueId}`),
            ]);

            const propertyData = propertyCourseRes.data;
            const matchedCourse = courseRes.data.find(course => course.uniqueId === propertyData.course_id);

            setPropertyCourse(propertyData);
            setCourseDetails(matchedCourse || null);
        } catch (error) {
            console.error('Failed to fetch course and property data:', error);
        }
    };

    useEffect(() => {
        if (courseUniqueId) {
            fetchCourseAndPropertyCourse();
        }
    }, [courseUniqueId]);

    return (
        <div className="card p-4 shadow-sm rounded-lg bg-white">
            <h5 className="mb-4 font-semibold text-lg">Course Details</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">ID</th>
                        <td>{propertyCourse?.course_id || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Name</th>
                        <td>{courseDetails?.name || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Short Name</th>
                        <td>{courseDetails?.short_name || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Specialization</th>
                        <td>{courseDetails?.specialization || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Duration</th>
                        <td>{courseDetails?.duration || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Course Type</th>
                        <td>{courseDetails?.course_type[0].value || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Category</th>
                        <td>{courseDetails?.category[0].value || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Program Type</th>
                        <td>{courseDetails?.program_type || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Sub Category</th>
                        <td>{courseDetails?.sub_category[0].value || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Stream</th>
                        <td>{courseDetails?.stream[0].value || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Eligibility</th>
                        <td>
                            <div
                                className={showFullEligibility ? '' : 'third-line-ellipsis'}
                            >
                                {courseDetails?.eligibility || '—'}
                            </div>
                            {courseDetails?.eligibility && courseDetails.eligibility.length > 100 && (
                                <span
                                    onClick={() => setShowFullEligibility(!showFullEligibility)}
                                    style={{
                                        color: '#007bff',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        marginTop: '5px'
                                    }}
                                    className="underline"
                                >
                                    {showFullEligibility ? 'Read less' : 'Read more'}
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Description</th>
                        <td>
                            {courseDetails?.description ? (
                                <div dangerouslySetInnerHTML={{ __html: courseDetails.description }} />
                            ) : (
                                '—'
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Status</th>
                        <td>{courseDetails?.status || '—'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

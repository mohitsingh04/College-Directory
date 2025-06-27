import React, { Fragment, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddCourse from './AddCourse';
import ViewCourse from './ViewCourse';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Course() {
    const [toggleCoursePage, setToggleCoursePage] = useState(true);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [viewCoursePage, setViewCoursePage] = useState(false);
    const { uniqueId } = useParams();
    const [courseUniqueId, setCourseUniqueId] = useState("");
    const [course, setCourse] = useState([]);
    const [propertyCourse, setPropertyCourse] = useState([]);
    const [propertyCourseDetails, setPropertyCourseDetails] = useState([]);

    const fetchCourseAndPropertyCourse = async () => {
        try {
            const [courseRes, propertyCourseRes] = await Promise.all([
                API.get('/course'),
                API.get('/property-course'),
            ]);

            const allCourses = courseRes.data;
            const propertyCourses = propertyCourseRes.data.filter(
                (item) => item.propertyId === Number(uniqueId)
            );

            setCourse(allCourses);
            setPropertyCourse(propertyCourses);

            const matchedDetails = propertyCourses.map((pc) => {
                const matchedCourse = allCourses.find((c) => c.uniqueId === pc.course_id);
                return {
                    ...pc,
                    courseDetails: matchedCourse || {},
                };
            });

            setPropertyCourseDetails(matchedDetails);

            // Auto show add form if no data exists
            setShowAddCourseForm(propertyCourses.length === 0);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (uniqueId) {
            fetchCourseAndPropertyCourse();
        }
    }, [uniqueId]);

    const handleDeleteCourse = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`/property-course/${id}`);
                    toast.success(response.data.message);
                    fetchCourseAndPropertyCourse();
                } catch (error) {
                    toast.error("Error deleting course");
                }
            }
        });
    };

    const handleViewCourse = (id) => {
        setCourseUniqueId(id);
        setViewCoursePage(true);
        setToggleCoursePage(false);
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row?.courseDetails?.name,
            sortable: true,
        },
        {
            name: 'Short Name',
            selector: row => row?.courseDetails?.short_name,
            sortable: true,
        },
        {
            name: 'Specialization',
            selector: row => row?.courseDetails?.specialization,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-sm btn-primary me-1"
                        title="View"
                        onClick={() => handleViewCourse(row.uniqueId)}
                    >
                        <i className="fe fe-eye"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-danger me-1"
                        title="Delete"
                        onClick={() => handleDeleteCourse(row.uniqueId)}
                    >
                        <i className="fe fe-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    const tableData = {
        columns,
        data: propertyCourseDetails,
        export: false,
        print: false
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between align-items-center'>
                    <div className="media-heading">
                        <h5>
                            <strong>
                                {viewCoursePage
                                    ? "View Course"
                                    : showAddCourseForm
                                        ? "Add Course"
                                        : "Course"
                                }
                            </strong>
                        </h5>
                    </div>
                    <div>
                        {viewCoursePage ? (
                            <button
                                className="btn btn-danger btn-sm"
                                title="Back to List"
                                onClick={() => {
                                    setViewCoursePage(false);
                                    setToggleCoursePage(true);
                                    setShowAddCourseForm(false);
                                }}
                            >
                                <i className="fe fe-x"></i>
                            </button>
                        ) : showAddCourseForm ? (
                            <button
                                className="btn btn-danger btn-sm"
                                title="Close"
                                onClick={() => setShowAddCourseForm(false)}
                            >
                                <i className="fe fe-x"></i>
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm"
                                title="Add Course"
                                onClick={() => {
                                    setShowAddCourseForm(true);
                                    setViewCoursePage(false);
                                }}
                            >
                                <i className="fe fe-plus"></i> Add Course
                            </button>
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    {viewCoursePage ? (
                        <ViewCourse
                            courseUniqueId={courseUniqueId}
                            onBack={() => {
                                setViewCoursePage(false);
                                setToggleCoursePage(true);
                            }}
                        />
                    ) : showAddCourseForm ? (
                        <AddCourse
                            onCourseAdded={() => {
                                setShowAddCourseForm(false);
                                fetchCourseAndPropertyCourse();
                            }}
                        />
                    ) : (
                        <>
                            {propertyCourseDetails.length > 0 ? (
                                <DataTableExtensions {...tableData}>
                                    <DataTable
                                        noHeader
                                        defaultSortFieldId="id"
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                    />
                                </DataTableExtensions>
                            ) : (
                                <p>No Course Found</p>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

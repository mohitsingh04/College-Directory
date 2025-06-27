import React, { Fragment, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddFaculty from './AddFaculty';
import EditFaculty from './EditFaculty';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ALLImages from '../../../../common/Imagesdata';

export default function Faculty() {
    const [toggleFacultyPage, setToggleFacultyPage] = useState(true);
    const [showAddFacultyForm, setShowAddFacultyForm] = useState(false);
    const { uniqueId } = useParams();
    const [faculty, setFaculty] = useState([]);
    const [facultyUniqueId, setFacultyUniqueId] = useState("");

    const fetchFaculty = async () => {
        try {
            const response = await API.get(`/faculty`);
            const filteredFaculty = response.data.filter((faculty) => faculty.propertyId === Number(uniqueId));
            setFaculty(filteredFaculty);

            if (filteredFaculty.length === 0) {
                setShowAddFacultyForm(true);
            } else {
                setShowAddFacultyForm(false);
            }
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, [uniqueId]);

    const handleShowFacultyPage = () => {
        setToggleFacultyPage(true);
        setFacultyUniqueId("");
    };

    const handleEditFaculty = (id) => {
        setToggleFacultyPage(false);
        setFacultyUniqueId(id);
    };

    const handleDeleteFaculty = (id) => {
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
                    const response = await API.delete(`/faculty/${id}`);
                    toast.success(response.data.message);
                    fetchFaculty();
                } catch (error) {
                    toast.error("Error deleting faculty");
                }
            }
        });
    };

    const columns = [
        {
            name: 'Profile',
            selector: row => (
                row.profile === "image.png"
                    ? <img src={ALLImages('avatar')} alt="profile" width={53} className="rounded-circle" />
                    : <img
                        src={`${import.meta.env.VITE_API_URL}${row.profile}`}
                        className='rounded-circle w-12 h-12'
                        alt="Profile"
                    />
            ),
            sortable: false,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Designation',
            selector: row => row.designation,
            sortable: true,
        },
        {
            name: 'Department',
            selector: row => row.department,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div>
                    <button className="btn btn-sm btn-primary me-1" title="Edit" onClick={() => handleEditFaculty(row.uniqueId)}>
                        <i className="fe fe-edit"></i>
                    </button>
                    <button className="btn btn-sm btn-danger me-1" title="Delete" onClick={() => handleDeleteFaculty(row.uniqueId)}>
                        <i className="fe fe-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    const tableData = {
        columns,
        data: faculty,
        export: false,
        print: false
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            <strong>
                                {faculty.length > 0
                                    ? toggleFacultyPage
                                        ? showAddFacultyForm
                                            ? "Add Faculty"
                                            : "Faculty"
                                        : "Edit Faculty"
                                    : "Add Faculty"}
                            </strong>
                        </h5>
                    </div>
                    <div>
                        {toggleFacultyPage ? (
                            faculty.length > 0 && (
                                <button
                                    className={`btn btn-${showAddFacultyForm ? 'danger' : 'primary'} btn-sm`}
                                    onClick={() => setShowAddFacultyForm(!showAddFacultyForm)}
                                >
                                    {showAddFacultyForm ? (
                                        <i className="fe fe-x"></i>
                                    ) : (
                                        <>
                                            <i className="fe fe-plus"></i> Add Faculty
                                        </>
                                    )}
                                </button>
                            )
                        ) : (
                            <button className="btn btn-danger btn-sm" title="Cancel" onClick={handleShowFacultyPage}>
                                <i className="fe fe-x"></i>
                            </button>
                        )}
                    </div>
                </Card.Header>

                <Card.Body>
                    {toggleFacultyPage ? (
                        showAddFacultyForm ? (
                            <AddFaculty
                                onFacultyAdded={() => {
                                    fetchFaculty();
                                    setShowAddFacultyForm(false);
                                }}
                            />
                        ) : faculty.length > 0 ? (
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
                            <p>No Faculty Found</p>
                        )
                    ) : (
                        <EditFaculty
                            facultyUniqueId={facultyUniqueId}
                            onFacultyUpdated={() => {
                                fetchFaculty();
                                setToggleFacultyPage(true);
                                setFacultyUniqueId("");
                            }}
                        />
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

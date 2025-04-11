import React, { Fragment, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddFaculty from './AddFaculty';
import EditFaculty from './EditFaculty';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ALLImages from '../../../../common/Imagesdata';

export default function Faculty() {
    const [toggleFacultyPage, setToggleFacultyPage] = useState(true);
    const { uniqueId } = useParams();
    const [faculty, setFaculty] = useState([]);
    const [facultyUniqueId, setFacultyUniqueId] = useState("");

    const fetchFaculty = async () => {
        try {
            const response = await API.get(`/faculty`);
            const filteredFaculty = response.data.filter((faculty) => faculty.propertyId === Number(uniqueId));
            setFaculty(filteredFaculty);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, [uniqueId]);

    const handleShowFacultyPage = () => {
        setToggleFacultyPage(true);
    }

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
            name: 'ID',
            selector: row => row.uniqueId,
            sortable: true,
        },
        {
            name: 'Profile',
            selector: row => (
                row.profile === "image.png"
                    ?
                    <img src={ALLImages('avatar')} alt="profile" width={53} className="rounded-circle" />
                    :
                    <img
                        src={`${import.meta.env.VITE_API_URL}${row.profile}`}
                        className='rounded-circle'
                        width={53}
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
            selector: (row) => [
                <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" title="Edit" onClick={() => handleEditFaculty(row.uniqueId)}>
                    <i className="fe fe-edit"></i>
                </button>,
                <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteFaculty(row.uniqueId)}>
                    <i className="fe fe-trash"></i>
                </button>
            ],
        },
    ];

    const data = faculty;

    const tableData = {
        columns,
        data,
        export: false,
        print: false
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            {faculty.length > 0
                                ?
                                toggleFacultyPage
                                    ?
                                    <strong>Faculty</strong>
                                    :
                                    <strong>Edit Faculty</strong>
                                :
                                <strong>Faculty</strong>
                            }
                        </h5>
                    </div>
                    <div>
                        {faculty.length > 0
                            ?
                            toggleFacultyPage ?
                                null
                                :
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowFacultyPage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            :
                            null
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    {toggleFacultyPage
                        ?
                        <>
                            {faculty.length > 0 ? (
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
                            )}

                        </>
                        :
                        <>
                            <EditFaculty facultyUniqueId={facultyUniqueId} />
                        </>
                    }
                </Card.Body>
            </Card>

            {toggleFacultyPage
                ?
                <>
                    <Card>
                        <Card.Header>
                            <div className="media-heading">
                                <h5>
                                    <strong>Add Faculty</strong>
                                </h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <AddFaculty />
                        </Card.Body>
                    </Card>
                </>
                :
                null
            }
        </Fragment>
    );
}

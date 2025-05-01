import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Card, Breadcrumb } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import ALLImages from "../../common/Imagesdata";
import LoadingBar from 'react-top-loading-bar';

export default function AllExam() {
    const navigate = useNavigate();
    const [exam, setExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const loadingBarRef = useRef(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setHandlePermissionLoading(true);
                startLoadingBar();

                const [authResponse, examResponse] = await Promise.all([
                    API.get("/profile"),
                    API.get("/exam"),
                ]);

                setAuthUser(authResponse?.data?.data);

                const filteredExams = examResponse?.data?.filter((exam) => !exam.isDeleted);
                setExam(filteredExams);

            } catch (error) {
                toast.error(error.message || "Something went wrong while fetching data.");
            } finally {
                setLoading(false);
                setHandlePermissionLoading(false);
                stopLoadingBar();
            }
        };

        fetchData();
    }, []);


    const handleViewExam = (_id) => {
        navigate("/dashboard/exam/view/" + _id);
    };

    const handleEditExam = (_id) => {
        navigate("/dashboard/exam/edit/" + _id);
    };

    const handleDeleteExam = async (_id) => {
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
                    startLoadingBar();
                    const response = await API.delete(`/exam/${_id}`);
                    toast.success(response.data.message);
                    fetchData();
                } catch (error) {
                    toast.error("Failed to delete exam: " + error.message);
                } finally {
                    stopLoadingBar();
                }
            }
        });
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.uniqueId || <Skeleton />,
            sortable: true,
        },
        {
            name: 'Logo',
            selector: row => (
                row.logo === "image.png"
                    ?
                    <img src={ALLImages('logo4')} alt="logo" className="list-logo" />
                    :
                    <img src={`${import.meta.env.VITE_API_URL}${row.logo}`} alt="Exam Logo" className="list-logo" />
            ),
            sortable: false,
        },
        {
            name: 'Name',
            selector: row => row.name || <Skeleton />,
            sortable: true,
        },
        {
            name: 'Short Name',
            selector: row => row.short_name || <Skeleton />,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <>
                    {row.status === "Active"
                        ? <span className="badge bg-success">Active</span>
                        : row.status === "Suspended"
                            ? <span className="badge bg-danger">Suspended</span>
                            : row.status === "Pending"
                                ? <span className="badge bg-warning">Pending</span>
                                : <span className="badge bg-secondary">Unknown</span>
                    }
                </>
            ),
            sortable: true,
        },
        {
            name: "Action",
            cell: row => (
                <>
                    {authUser?.permission.some((items) => items.value !== "Read Exam") ? (
                        <button className="btn btn-sm btn-success me-1" title="View" onClick={() => handleViewExam(row._id)}>
                            <i className="fe fe-eye"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Update Exam") ? (
                        <button className="btn btn-sm btn-primary me-1" title="Edit" onClick={() => handleEditExam(row._id)}>
                            <i className="fe fe-edit"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Delete Exam") ? (
                        <button className="btn btn-sm btn-danger me-1" title="Delete" onClick={() => handleDeleteExam(row._id)}>
                            <i className="fe fe-trash"></i>
                        </button>
                    ) : (
                        null
                    )}
                </>
            ),
            ignoreRowClick: true,
            allowoverflow: true,
        }
    ];

    const tableData = {
        columns,
        data: exam,
        export: false,
        print: false
    };

    useEffect(() => {
        document.title = "AJ | All Exam";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Exam"
    );

    if (!handlePermissionLoading && authUser) {
        if (!hasPermission) {
            return (
                <div className="position-absolute top-50 start-50 translate-middle">
                    USER DOES NOT HAVE THE RIGHT ROLES.
                </div>
            );
        }
    }

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div>
                    <h1 className="page-title fw-semibold fs-20 mb-0">Exam</h1>
                    <Breadcrumb className='mb-0'>
                        <Breadcrumb.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Exam</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Exam</h3>
                            <div className="card-options ms-auto">
                                <Link to="/dashboard/exam/add">
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new Exam
                                    </button>
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <>
                                    <Skeleton width={150} height={25} />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Logo</th>
                                                <th>Name</th>
                                                <th>Short Name</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(4)].map((_, i) => (
                                                <tr key={i}>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                    <td><Skeleton width={150} height={25} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="float-end mt-2">
                                        <Skeleton width={350} height={25} />
                                    </div>
                                </>
                            ) : (
                                <DataTableExtensions {...tableData}>
                                    <DataTable
                                        noHeader
                                        defaultSortFieldId="id"
                                        defaultSortAsc={false}
                                        pagination
                                        striped
                                        highlightOnHover
                                        pointerOnHover
                                    />
                                </DataTableExtensions>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </Fragment>
    );
}

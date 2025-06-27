import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Card, Breadcrumb } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function AllUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingBarRef = useRef(null);
    const [authUser, setAuthUser] = useState(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    const fetchData = async () => {
        try {
            setLoading(true);
            setHandlePermissionLoading(true);
            startLoadingBar();

            const [authResponse, userResponse] = await Promise.all([
                API.get("/profile"),
                API.get("/user"),
            ]);

            setAuthUser(authResponse?.data?.data);

            const filteredUsers = userResponse?.data?.filter((user) => !user.isDeleted);
            setUser(filteredUsers);

        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
            setHandlePermissionLoading(false);
            stopLoadingBar();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewUser = (_id) => {
        navigate("/dashboard/user/view/" + _id);
    };

    const handleEditUser = (_id) => {
        navigate("/dashboard/user/edit/" + _id);
    };

    const handleDeleteUser = async (_id) => {
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
                    const response = await API.delete(`/user/${_id}`);
                    if (response.status === 200) {
                        toast.success(response.data.message);
                        fetchData();
                    }
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 400) {
                            toast.error(error.response.data.error || "Bad Request");
                            setError(error.response.data.error);
                        } else if (error.response.status === 500) {
                            toast.error("Internal server error, please try again later.");
                        } else {
                            toast.error("Something went wrong, please try again.");
                        }
                    } else {
                        toast.error(`Error deleting user: ${error.message}`);
                    }
                } finally {
                    stopLoadingBar();
                }
            }
        });
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => `+${row.phone}` || "Null",
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role || "Null",
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <>
                    {row.status === "Active"
                        ? <span className="badge bg-success">{row.status}</span>
                        : row.status === "Suspended"
                            ? <span className="badge bg-danger">{row.status}</span>
                            : row.status === "Pending"
                                ? <span className="badge bg-warning">{row.status}</span>
                                : <span className="badge bg-secondary">Unknown</span>
                    }
                </>
            ),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    {authUser?.permission.some((items) => items.value !== "Read Agent") ? (
                        <button className="btn btn-sm btn-success me-1" data-bs-toggle="tooltip" title="View" onClick={() => handleViewUser(row._id)}>
                            <i className="fe fe-eye"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Update Agent") ? (
                        <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" title="Edit" onClick={() => handleEditUser(row._id)}>
                            <i className="fe fe-edit"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Delete Agent") ? (
                        <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteUser(row._id)}>
                            <i className="fe fe-trash"></i>
                        </button>
                    ) : (
                        null
                    )}
                </>
            ),
        },
    ];

    const data = user;

    const tableData = {
        columns,
        data,
        export: false,
        print: false
    };

    useEffect(() => {
        document.title = "AJ | All Users";
    }, []);

    useEffect(() => {
        if (authUser) {
            if (authUser?.role !== "Super Admin" && authUser?.role !== "Admin") {
                navigate("/dashboard");
            }
        }
    }, [authUser]);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read User"
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
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">User</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to="/dashboard">
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>User</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">User</h3>
                            <div className="card-options ms-auto">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary"
                                    onClick={() => navigate("/dashboard/user/add")}
                                >
                                    <i className="fe fe-plus"></i> Add a new User
                                </button>

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
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
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
                                        highlightOnHover
                                    />
                                </DataTableExtensions>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </Fragment>
    )
}

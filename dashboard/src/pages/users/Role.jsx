import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Card, Breadcrumb } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

const formatText = (text) => {
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function Role() {
    const { role } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingBarRef = useRef(null);
    const [authUser, setAuthUser] = useState(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
    const formattedRole = formatText(role);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getAuthUserData = async () => {
            try {
                setHandlePermissionLoading(true)
                const { data } = await API.get("/profile");
                setAuthUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setHandlePermissionLoading(false)
            }
        }

        getAuthUserData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await API.get("/user");
                const filteredUser = response?.data.filter((items) => items.role === formattedRole)
                setUser(filteredUser);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false)
            }
        }

        fetchUsers();
    }, []);

    const handleViewUser = (uniqueId) => {
        navigate("/dashboard/user/view/" + uniqueId);
    };

    const handleEditUser = (uniqueId) => {
        navigate("/dashboard/user/edit/" + uniqueId);
    };

    const handleDeleteUser = async (uniqueId) => {
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
                    const response = await API.delete(`/user/${uniqueId}`);
                    if (response.status === 200) {
                        toast.success(response.data.message);
                        getUsers();
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
        // {
        //     name: 'ID',
        //     selector: row => row.uniqueId,
        //     sortable: true,
        // },
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
            selector: row => row.phone || "Null",
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role || "Null",
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => [
                <>
                    {authUser?.permission.some((items) => items.value !== "Read User") ? (
                        <button className="btn btn-sm btn-success me-1" data-bs-toggle="tooltip" title="View" onClick={() => handleViewUser(row.uniqueId)}>
                            <i className="fe fe-eye"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Update User") ? (
                        <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" title="Edit" onClick={() => handleEditUser(row.uniqueId)}>
                            <i className="fe fe-edit"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Delete User") ? (
                        <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteUser(row.uniqueId)}>
                            <i className="fe fe-trash"></i>
                        </button>
                    ) : (
                        null
                    )}
                </>
            ],
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
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>{formattedRole}</Breadcrumb.Item>
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
                                <Link to={"/dashboard/user/add"}>
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new User
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
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
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

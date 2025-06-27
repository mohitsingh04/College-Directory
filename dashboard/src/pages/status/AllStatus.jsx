import React, { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Card, Breadcrumb } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function AllStatus() {
    const navigate = useNavigate();
    const [status, setStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const loadingBarRef = useRef(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

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

    const getStatus = useCallback(async () => {
        startLoadingBar();
        setLoading(true);
        try {
            const response = await API.get("/status");
            setStatus(response.data);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            stopLoadingBar();
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getStatus();
    }, [getStatus]);

    const handleViewStatus = useCallback((objectId) => navigate(`/dashboard/status/view/${objectId}`), [navigate]);
    const handleEditStatus = useCallback((objectId) => navigate(`/dashboard/status/edit/${objectId}`), [navigate]);

    const handleDeleteStatus = useCallback((objectId) => {
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
                    setLoading(true);
                    const response = await API.delete(`/status/${objectId}`);
                    toast.success(response.data.message);
                    getStatus();
                } catch (error) {
                    toast.error("Error deleting status");
                } finally {
                    stopLoadingBar();
                    setLoading(false);
                }
            }
        });
    }, [getStatus]);

    const ActionButtons = ({ objectId, onView, onEdit, onDelete }) => (
        <>
            {authUser?.permission.some((items) => items.value !== "Read Status") ? (
                <button className="btn btn-sm btn-success me-1" title="View" onClick={() => onView(objectId)}>
                    <i className="fe fe-eye"></i>
                </button>
            ) : (
                null
            )}
            {authUser?.permission.some((items) => items.value !== "Update Status") ? (
                <button className="btn btn-sm btn-primary me-1" title="Edit" onClick={() => onEdit(objectId)}>
                    <i className="fe fe-edit"></i>
                </button>
            ) : (
                null
            )}
            {authUser?.permission.some((items) => items.value !== "Delete Status") ? (
                <button className="btn btn-sm btn-danger" title="Delete" onClick={() => onDelete(objectId)}>
                    <i className="fe fe-trash"></i>
                </button>
            ) : (
                null
            )}
        </>
    );

    const columns = [
        { name: 'ID', selector: row => row.uniqueId, sortable: true },
        { name: 'Status', selector: row => row.parent_status, sortable: true },
        { name: 'Parent Status', selector: row => row.status_name, sortable: true },
        {
            name: "Action",
            cell: (row) => (
                <ActionButtons
                    objectId={row._id}
                    onView={handleViewStatus}
                    onEdit={handleEditStatus}
                    onDelete={handleDeleteStatus}
                />
            ),
        },
    ];

    const tableData = { columns, data: status, export: false, print: false };

    useEffect(() => {
        document.title = "AJ | All Status";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Status"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Status</h1>
                    <Breadcrumb className='mb-0'>
                        <Breadcrumb.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Status</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Status</h3>
                            <div className="card-options ms-auto">
                                <Link to="/dashboard/status/add">
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new Status
                                    </button>
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <>
                                    <LoadingBar color="#ff5b00" ref={loadingBarRef} />
                                    <Skeleton width={150} height={25} />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Status</th>
                                                <th>Parent Status</th>
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
    );
}

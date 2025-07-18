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

export default function AllProperty() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [mergedData, setMergedData] = useState([]);
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

    const fetchAndMergeData = async () => {
        try {
            startLoadingBar();
            const propertyResponse = await API.get("/property");
            const propertyList = authUser?.role === "Super Admin"
                ? propertyResponse.data
                : authUser?.role === "Admin" || authUser?.role === "Editor"
                    ? propertyResponse.data
                    : propertyResponse.data.filter((items) => items?.userId === authUser?.uniqueId);

            const locationResponse = await API.get("/location");
            const locationList = locationResponse.data;

            const merged = propertyList.map((property) => {
                const location = locationList.find(
                    (loc) => loc.propertyId === property.uniqueId
                );
                return {
                    ...property,
                    location: location || null,
                };
            });

            setMergedData(merged);
        } catch (error) {
            toast.error(error.message);
        } finally {
            stopLoadingBar();
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchAndMergeData();
    }, [authUser]);

    const handleViewProperty = (id) => {
        navigate("/dashboard/property/view/" + id);
    };

    const handleEditProperty = (id) => {
        navigate("/dashboard/property/edit/" + id);
    };

    const handleDeleteProperty = async (id) => {
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
                    setLoading(true);
                    const response = await API.delete(`/property/${id}`);
                    toast.success(response.data.message);
                    fetchAndMergeData();
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    setLoading(false);
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
            name: 'Logo',
            selector: row => (
                row.logo === "image.png"
                    ?
                    <img src={ALLImages('logo4')} alt="logo" className="list-logo" />
                    :
                    <img src={`${import.meta.env.VITE_API_URL}${row.logo}`} alt="logo" className="list-logo" />
            ),
            sortable: false,
        },
        {
            name: 'Property',
            selector: row => row.property_name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.property_type,
            sortable: true,
        },
        {
            name: 'State',
            selector: row => row.location?.state || "Null",
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
                                ? <span title="Your property needs some revision before it's listed!" className="badge bg-warning">Pending</span>
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
                    {authUser?.permission.some((items) => items.value !== "Read Property") ? (
                        <button className="btn btn-sm btn-success me-1" data-bs-toggle="tooltip" title="View" onClick={() => handleViewProperty(row.uniqueId)}>
                            <i className="fe fe-eye"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Delete Property") ? (
                        <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteProperty(row.uniqueId)}>
                            <i className="fe fe-trash"></i>
                        </button>
                    ) : (
                        null
                    )}
                </>
            ),
        },
    ];

    const data = mergedData;

    const tableData = {
        columns,
        data,
        export: false,
        print: false
    };

    useEffect(() => {
        document.title = "AJ | All Property";
    }, []);

    useEffect(() => {
        if (authUser?.role === "Property Manager") {
            navigate('/dashboard');
        }
    }, [authUser?.role]);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Property"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Property</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Property</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Property</h3>
                            <div className="card-options ms-auto">
                                {authUser?.role === "Property Manager"
                                    ? null
                                    :
                                    <Link to={"/dashboard/property/add"}>
                                        <button type="button" className="btn btn-md btn-primary">
                                            <i className="fe fe-plus"></i> Add a new Property
                                        </button>
                                    </Link>
                                }
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
                                                <th>Property</th>
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
    );
}

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

export default function AllCategory() {
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
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

    const getCategory = async () => {
        try {
            startLoadingBar();
            setLoading(true)
            const response = await API.get("/category");
            setCategory(response.data)
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            stopLoadingBar();
            setLoading(false)
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    const handleViewCategory = (_id) => {
        navigate("/dashboard/category/view/" + _id);
    };

    const handleEditCategory = (_id) => {
        navigate("/dashboard/category/edit/" + _id);
    };

    const handleDeleteCategory = async (_id) => {
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
                    const response = await API.delete(`/category/${_id}`);
                    toast.success(response.data.message);
                    getCategory();
                } catch (error) {
                    toast.error(error.message);
                } finally {
                    stopLoadingBar();
                    getCategory();
                    setLoading(false);
                }
            }
        });
    }

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
                    <img src={ALLImages('noImage')} alt="logo" className="list-logo" />
                    :
                    <img src={`${import.meta.env.VITE_API_URL}${row.logo}`} alt="logo" className="list-logo" loading="lazy" />
            ),
            sortable: false,
        },
        {
            name: 'Category',
            selector: row => row.parent_category,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                row.status === "Active"
                    ? <span className="badge bg-success">Active</span>
                    : row.status === "Suspended"
                        ? <span className="badge bg-danger">Suspended</span>
                        : row.status === "Pending"
                            ? <span className="badge bg-warning">Pending</span>
                            : <span className="badge bg-secondary">Unknown</span>
            ),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    {authUser?.permission.some((items) => items.value !== "Read Category") ? (
                        <button className="btn btn-sm btn-success me-1" data-bs-toggle="tooltip" title="View" onClick={() => handleViewCategory(row._id)}>
                            <i className="fe fe-eye"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Update Category") ? (
                        <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" title="Edit" onClick={() => handleEditCategory(row._id)}>
                            <i className="fe fe-edit"></i>
                        </button>
                    ) : (
                        null
                    )}
                    {authUser?.permission.some((items) => items.value !== "Delete Category") ? (
                        <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteCategory(row._id)}>
                            <i className="fe fe-trash"></i>
                        </button>
                    ) : (
                        null
                    )}
                </>
            ),
        },
    ];

    const data = category;

    const tableData = {
        columns,
        data,
        export: false,
        print: false
    };

    useEffect(() => {
        document.title = "AJ | All Category";
    }, []);

    const hasPermission = authUser?.permission?.some(
        (item) => item.value === "Read Category"
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
                    <h1 className="page-title fw-semibold fs-20 mb-0">Category</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Category</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Category</h3>
                            <div className="card-options ms-auto">
                                <Link to={"/dashboard/category/add"}>
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new Category
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
                                                <th>Category</th>
                                                <th>Parent Category</th>
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
                                    // dense
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

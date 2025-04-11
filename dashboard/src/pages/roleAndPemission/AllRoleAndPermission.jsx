import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Row, Card, Breadcrumb, Button } from "react-bootstrap";
import { EditprofileData } from "../../common/Commomarreydata";
import { toast } from "react-hot-toast";
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default function AllRoleAndPermission() {
    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                toast.success("Status Deleted");
                //   Swal.fire({
                //     title: "Deleted!",
                //     text: "Status Deleted.",
                //     icon: "success"
                //   });
            }
        });
    }

    return (
        <Fragment>
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">Role And Permission</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Role And Permission</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <Row>
                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Roles</h3>
                            <div className="card-options ms-auto">
                                <Link to={"/dashboard/role/add"}>
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new Role
                                    </button>
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <table className="table text-nowrap table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {EditprofileData.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.date}</td>
                                                <td>
                                                    <Link className="btn btn-sm btn-success me-2" to={`/dashboard/role/edit/${item.id}`}><i className="fe fe-edit"></i> Edit</Link>
                                                    <Link className="btn btn-sm btn-primary me-2" to={`/dashboard/role/view/${item.id}`}><i className="fe fe-eye"></i> View</Link>
                                                    <Button className="btn btn-sm btn-danger" onClick={handleDelete}>
                                                        <i className="fe fe-trash"></i> Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-12">
                    <Card className="custom-card">
                        <Card.Header>
                            <h3 className="card-title">Permissions</h3>
                            <div className="card-options ms-auto">
                                <Link to={"/dashboard/permission/add"}>
                                    <button type="button" className="btn btn-md btn-primary">
                                        <i className="fe fe-plus"></i> Add a new Permission
                                    </button>
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-responsive">
                                <table className="table text-nowrap table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {EditprofileData.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.date}</td>
                                                <td>
                                                    <Link className="btn btn-sm btn-success me-2" to={`/dashboard/permission/edit/${item.id}`}><i className="fe fe-edit"></i> Edit</Link>
                                                    <Link className="btn btn-sm btn-primary me-2" to={`/dashboard/permission/view/${item.id}`}><i className="fe fe-eye"></i> View</Link>
                                                    <Button className="btn btn-sm btn-danger" onClick={handleDelete}>
                                                        <i className="fe fe-trash"></i> Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Row>
        </Fragment>
    )
}

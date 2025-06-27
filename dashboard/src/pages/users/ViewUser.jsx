import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';
import ALLImages from "../../common/Imagesdata";

export default function ViewUser() {
  const navigate = useNavigate();
  const { objectId } = useParams();
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const getUser = async () => {
      try {
        startLoadingBar();
        const { data } = await API.get(`/user/${objectId}`);
        setUser(data);
      } catch (error) {
        toast.error('Error fetching user: ' + error.message);
      } finally {
        stopLoadingBar();
      }
    };

    getUser();
  }, [objectId]);

  useEffect(() => {
    document.title = "AJ | View User";
  }, []);

  useEffect(() => {
    if (authUser) {
      if (authUser?.role !== "Super Admin" && authUser?.role !== "Admin") {
        return navigate("/dashboard");
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

  const handleRedirect = (_id) => {
    navigate("/dashboard/user/edit/" + _id);
  }

  return (
    <Fragment>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">View User</h1>
          <Breadcrumb className='mb-0'>
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/dashboard/users">User</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>View</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">View User Details</h3>
          <div className="card-options ms-auto">
            <button type="button" className="btn btn-md btn-success me-1" onClick={() => handleRedirect(user?._id)}>
              <i className="fe fe-edit"></i> Edit
            </button>
            <Link to="/dashboard/users">
              <button type="button" className="btn btn-md btn-primary">
                <i className="fe fe-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div>
            {!user ? (
              <>
                <Skeleton width={100} height={100} className="rounded-circle" />
                <Skeleton width={300} className="mt-3" />
                <Skeleton width={300} className="mt-3" />
                <Skeleton width={300} className="mt-3" />
                <Skeleton width={300} className="mt-3" />
                <Skeleton width={900} className="mt-3" />
                <Skeleton width={900} />
                <Skeleton width={900} />

              </>
            ) : (
              <>
                {user?.profile_image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`}
                    alt="User Profile Preview"
                    className="rounded-circle mt-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={ALLImages('male_avatar_icon')}
                    alt="User Profile Preview"
                    className="rounded-circle mt-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
                <p className="mt-3"><strong>Name: </strong>{user?.name}</p>
                <p className="mt-3"><strong>Email: </strong>{user?.email}</p>
                <p className="mt-3"><strong>Phone: </strong>+{user?.phone}</p>
                <p className="mt-3"><strong>Address: </strong>{user?.address || 'N/A'}, {user?.city || 'N/A'}, {user?.state || 'N/A'}</p>
                <p className="mt-3"><strong>Pincode: </strong>{user?.pincode || 'N/A'}</p>
                <p className="mt-3"><strong>Role: </strong>{user?.role}</p>
                <p className="mt-3"><strong>Permissions: </strong>
                  {Array.isArray(user?.permission) ? (
                    user?.permission.map((item, index) => (
                      <span key={index}>
                        {item.label}
                        {index < user?.permission.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    "N/A"
                  )}
                </p>
                <div className="mb-0">
                  {user?.status === "Active"
                    ? <span className="badge bg-success">Active</span>
                    : user?.status === "Suspended"
                      ? <span className="badge bg-danger">Suspended</span>
                      : user?.status === "Pending"
                        ? <span className="badge bg-warning">Pending</span>
                        : <span className="badge bg-secondary">Unknown</span>
                  }
                </div>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}

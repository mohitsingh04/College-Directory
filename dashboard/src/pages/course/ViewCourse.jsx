import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import OwlCarousel from 'react-owl-carousel';
import LoadingBar from 'react-top-loading-bar';

export default function ViewCourse() {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [course, setCourse] = useState(null);
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
    const getCourse = async () => {
      try {
        startLoadingBar();
        const { data } = await API.get(`/course/${Id}`);
        setCourse(data);
      } catch (error) {
        toast.error('Error fetching course: ' + error.message);
      } finally {
        stopLoadingBar();
      }
    };

    getCourse();
  }, [Id]);

  const options = {
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  };

  useEffect(() => {
    document.title = "AJ | View Course";
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

  const handleRedirect = (_id) => {
    navigate("/dashboard/course/edit/" + _id);
  }

  return (
    <Fragment>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div className="">
          <h1 className="page-title fw-semibold fs-20 mb-0">View Course</h1>
          <div className="">
            <Breadcrumb className='mb-0'>
              <Breadcrumb.Item>
                <Link to={'/dashboard'}>
                  Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={'/dashboard/course'}>
                  Course
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>View</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">View Course Details</h3>
          <div className="card-options ms-auto">
            <button type="button" className="btn btn-md btn-success me-1" onClick={() => handleRedirect(course?._id)}>
              <i className="fe fe-edit"></i> Edit
            </button>
            <Link to="/dashboard/course">
              <button type="button" className="btn btn-md btn-primary">
                <i className="fe fe-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div>
            {course ? (
              <>
                <div className="mb-1">
                  {course?.status === "Active"
                    ? <span className="badge bg-success">Active</span>
                    : course?.status === "Suspended"
                      ? <span className="badge bg-danger">Suspended</span>
                      : course?.status === "Pending"
                        ? <span className="badge bg-warning">Pending</span>
                        : <span className="badge bg-secondary">Unknown</span>
                  }
                </div>
                <h3 className="mt-3">{course.name}  ({course.short_name})</h3>
                <h4>What is BCA Course All About?</h4>
                {course.description.length >= 1500 ? (
                  <>
                    <p
                      style={{ fontSize: "16px", border: "1px dashed gray", padding: "20px 20px" }}
                      dangerouslySetInnerHTML={{
                        __html: isExpanded
                          ? course.description
                          : course.description.substring(0, 1200) + "...",
                      }}
                    />
                    <button onClick={toggleReadMore} className="text-blue-700 underline">
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  <p style={{ fontSize: "16px", border: "1px dashed gray", padding: "20px 20px" }} dangerouslySetInnerHTML={{ __html: course.description }} />
                )}
                <h4>BCA Eligibility Criteria
                  <br />
                  <span className="fs-6">
                    {course.eligibility}
                  </span>
                </h4>
                <OwlCarousel className="owl-theme my-5" {...options}>
                  {[
                    { label: "Course Type", value: course.course_type[0].value },
                    { label: "Stream", value: course.stream[0].value },
                    { label: "Category", value: course.category[0].value },
                    { label: "Sub category", value: course.sub_category[0].value },
                    { label: "Course Type", value: course.course_type[0].value },
                    { label: "Course Duration", value: course.duration },
                  ].map((item, index) => (
                    <div key={index} className="item flex justify-center items-center">
                      <div
                        className="p-5 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-64 bg-white"
                        style={{ minHeight: "120px" }}
                      >
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          {item.label}:
                        </h4>
                        <p className="text-gray-600">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              </>
            ) : (
              <>
                <h3 className="mt-3"><Skeleton width={300} /></h3>
                <p style={{ fontSize: "16px" }}><Skeleton count={3} /></p>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}

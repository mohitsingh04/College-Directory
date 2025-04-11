import React, { Fragment, useRef, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Breadcrumb } from "react-bootstrap";
import toast from "react-hot-toast";
import { API } from "../../services/API";
import Skeleton from "react-loading-skeleton";
import ALLImages from "../../common/Imagesdata";
import LoadingBar from 'react-top-loading-bar';

export default function ViewExam() {
  const navigate = useNavigate();
  const { Id } = useParams();
  const [exam, setExam] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const loadingBarRef = useRef(null);
  const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

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
    const getExam = async () => {
      try {
        startLoadingBar();
        setLoading(true);
        const { data } = await API.get(`/exam/${Id}`);
        setExam(data);
      } catch (error) {
        toast.error('Error fetching exam: ' + error.message);
      } finally {
        stopLoadingBar();
        setLoading(false)
      }
    };

    getExam();
  }, [Id]);

  useEffect(() => {
    document.title = "AJ | View Exam";
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

  const handleRedirect = (_id) => {
    navigate("/dashboard/exam/edit/" + _id);
  }

  return (
    <Fragment>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <h1 className="page-title fw-semibold fs-20 mb-0">View Exam</h1>
          <Breadcrumb className='mb-0'>
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/dashboard/exam">Exam</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>View</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card className="custom-card">
        <Card.Header>
          <h3 className="card-title">View Exam Details</h3>
          <div className="card-options ms-auto">
            <button type="button" className="btn btn-md btn-success me-1" onClick={() => handleRedirect(exam?._id)}>
              <i className="fe fe-edit"></i> Edit
            </button>
            <Link to="/dashboard/exam">
              <button type="button" className="btn btn-md btn-primary">
                <i className="fe fe-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          <div>
            {loading ? (
              <>
                <Skeleton width={450} height={300} />
                <Skeleton width={56} height={56} className="mt-3" />
                <h3 className="mt-3"><Skeleton width={300} /></h3>
                <p style={{ fontSize: "16px" }}><Skeleton count={3} /></p>
                <Skeleton width={450} height={250} className="mt-3" />
              </>
            ) : (
              <>
                <div className="mb-1">
                  {exam?.status === "Active"
                    ? <span className="badge bg-success">Active</span>
                    : exam?.status === "Suspended"
                      ? <span className="badge bg-danger">Suspended</span>
                      : exam?.status === "Pending"
                        ? <span className="badge bg-warning">Pending</span>
                        : <span className="badge bg-secondary">Unknown</span>
                  }
                </div>
                {exam?.featured_image && (
                  exam?.featured_image === "image.png" ? (
                    <img src={ALLImages('logo4')} alt="logo" className="mb-3 w-96 h-40" />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${exam?.featured_image}`}
                      alt="Featured Image Preview"
                      onError={(e) => { e.target.src = <Skeleton />; }}
                      className="mb-3 w-96 h-40"
                    />
                  )
                )}
                {exam?.logo && (
                  exam?.logo === "image.png" ? (
                    <img src={ALLImages('logo4')} alt="logo" />
                  ) : (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${exam?.logo}`}
                      alt="Logo Preview"
                      className="mb-3"
                      width={56}
                      onError={(e) => { e.target.src = <Skeleton />; }}
                    />
                  )
                )}
                <h3 className="mt-3">{exam?.name} ({exam?.short_name})</h3>
                {exam?.description.length >= 1500 ? (
                  <>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: isExpanded
                          ? exam?.description
                          : exam?.description.substring(0, 1200) + "...",
                      }}
                    />
                    <button onClick={toggleReadMore} className="text-blue-700 underline">
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  </>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: exam?.description }} />
                )}
                <p><strong>Exam Date:</strong>  {exam?.upcoming_exam_date}</p>
                <p><strong>Result Date:</strong>  {exam?.result_date}</p>
                <p><strong>Podcast:</strong>  <a className="text-decoration-underline" href={`${import.meta.env.VITE_API_URL}${exam?.podcast_hindi}`} target="blank">Hindi</a> | <a className="text-decoration-underline" href={`${import.meta.env.VITE_API_URL}${exam?.podcast_english}`} target="blank">English</a></p>
                <p><strong>Application Form Date:</strong>  {exam?.application_form_date}</p>
                <p><strong>Application Form Link:</strong>  <Link className="text-decoration-underline" to={`${exam?.application_form_link}`} target="blank">View</Link></p>
                <p><strong>Exam Form Link:</strong>  <Link className="text-decoration-underline" to={`${exam?.exam_form_link}`} target="blank">View</Link></p>
                <p><strong>Exam Mode: </strong>
                  {Array.isArray(exam?.exam_mode) ? (
                    exam?.exam_mode.map((item, index) => (
                      <span key={index}>
                        {item.label}
                        {index < exam?.exam_mode.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    "N/A"
                  )}
                </p>
                <iframe
                  width="450"
                  height="250"
                  src={`https://www.youtube.com/embed/${exam?.youtube_link.split("v=")[1]?.split("&")[0]}`}
                  title={exam?.youtube_link}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}

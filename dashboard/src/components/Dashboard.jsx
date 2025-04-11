import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Card, OverlayTrigger, Tooltip, Dropdown, Pagination, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from '../layouts/layoutcomponents/Pageheader';
import { TableData, TableSelect } from '../common/Commomarreydata';
import { RecentOrders, Totaltransactions } from '../common/OtherChartfunction';
import ALLImages from '../common/Imagesdata';
import Select from 'react-select'
import { API } from '../services/API';
import LoadingBar from 'react-top-loading-bar';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [User, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [examData, setExamData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const loadingBarRef = useRef(null);

  const startLoadingBar = () => loadingBarRef.current?.continuousStart();
  const stopLoadingBar = () => loadingBarRef.current?.complete();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        startLoadingBar();
        const responses = await Promise.all([
          API.get("/profile"),
          API.get("/user"),
          API.get("/status"),
          API.get("/category"),
          API.get("/exam"),
          API.get("/course"),
          API.get("/property"),
        ]);

        setUser(responses[0].data?.data);
        setUserData(responses[1].data);
        setStatusData(responses[2].data);
        setCategoryData(responses[3].data);
        setExamData(responses[4].data);
        setCourseData(responses[5].data);
        setPropertyData(responses[6].data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        stopLoadingBar();
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    document.title = "AJ | Dashboard";
  }, []);

  return (
    <div>
      <LoadingBar color="#ff5b00" ref={loadingBarRef} />
      {/* <Pageheader homepage='Dashboard' activepage='Home' page='Dashboard' /> */}
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div className="">
          <h1 className="page-title fw-semibold fs-20 mb-0">Dashboard</h1>
          <div className="">
            <Breadcrumb className='mb-0'>
              <Breadcrumb.Item>
                <Link to={'/dashboard'}>
                  Home
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Link to="/dashboard/property/add">
          <button type="button" className="btn btn-md btn-primary">
            <i className="fe fe-plus"></i> Add a new Property
          </button>
        </Link>
      </div>

      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row className="total-sales-card-section">
            {User ? (
              <>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/users" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14">{User?.role === "Super Admin" ? "Total Users" : "Total Sales"}</h6>
                            <h3 className="mb-2 number-font fs-24"><h3 className="mb-2 number-font fs-24">{User?.role === "Super Admin" ? userData?.length : "34,516"}</h3></h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div
                              className="counter-icon bg-primary-gradient box-shadow-primary rounded-circle ms-auto mb-0">
                              <i className="fe fe-users mb-5 "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/status" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14">{User?.role === "Super Admin" ? "Total Status" : "Total Leads"}</h6>
                            <h3 className="mb-2 number-font fs-24">{User?.role === "Super Admin" ? statusData?.length : "56,992"}</h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div
                              className="counter-icon bg-danger-gradient box-shadow-danger rounded-circle  ms-auto mb-0">
                              <i className="bi bi-bar-chart-line mb-5  "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/category" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14">{User?.role === "Super Admin" ? "Total Category" : "Total Profit"}</h6>
                            <h3 className="mb-2 number-font fs-24">{User?.role === "Super Admin" ? categoryData?.length : "$42,567"}</h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div
                              className="counter-icon bg-secondary-gradient box-shadow-secondary rounded-circle ms-auto mb-0">
                              <i className="bx bx-layer  mb-5 "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/exam" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14">{User?.role === "Super Admin" ? "Total Exam" : "Total Cost"}</h6>
                            <h3 className="mb-2 number-font fs-24">{User?.role === "Super Admin" ? examData?.length : "$34,789"}</h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div className="counter-icon bg-success-gradient box-shadow-success rounded-circle  ms-auto mb-0">
                              <i className="las la-edit mb-5 "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/course" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14">{User?.role === "Super Admin" ? "Total Course" : "Total Cost"}</h6>
                            <h3 className="mb-2 number-font fs-24">{User?.role === "Super Admin" ? courseData?.length : "$34,789"}</h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div className="counter-icon bg-warning-gradient box-shadow-success rounded-circle  ms-auto mb-0">
                              <i className="bx bx-file-blank mb-5 "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Link to={User?.role === "Super Admin" ? "/dashboard/property" : undefined} style={{ textDecoration: "none" }}>
                    <Card className="custom-card overflow-hidden">
                      <Card.Body>
                        <Row>
                          <div className="col">
                            <h6 className="fw-normal fs-14"><strong>Total Property</strong></h6>
                            <h3 className="mb-2 number-font fs-24">{propertyData?.length}</h3>
                          </div>
                          <div className="col col-auto mt-2">
                            <div className="counter-icon bg-light-gradient box-shadow-success rounded-circle  ms-auto mb-0">
                              <i className="bx bx-file-blank mb-5 "></i>
                            </div>
                          </div>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </>
            ) : (
              <>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
                <Col lg={6} md={6} sm={12} xl={3}>
                  <Skeleton width={242} height={122} className='mb-3' />
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Row>

      <Row>
        <Col sm={12} md={12} lg={12} xl={9}>
          <Card className="custom-card">
            <Card.Header>
              <h3 className="card-title">Total Transactions</h3>
            </Card.Header>
            <Card.Body className="pb-0">
              <Totaltransactions />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={12} xl={3}>
          <Card className="custom-card ">
            <Card.Header>
              <h3 className="card-title">Recent Orders</h3>
            </Card.Header>
            <Card.Body className="pt-0 ps-0 pe-0">
              <RecentOrders />

              <Row className="sales-product-infomation pb-0 mb-0 mx-auto wd-100p mt-4 justify-content-center">
                <Col md={6} className="col text-center">
                  <p className="mb-0 d-flex justify-content-center"><span
                    className="legend bg-primary"></span>Delivered</p>
                  <h3 className="mb-1 fw-bold">5238</h3>
                  <div className="d-flex justify-content-center ">
                    <p className="text-muted mb-0">Last 6 months</p>
                  </div>
                </Col>
                <Col md={6} className="col text-center float-end">
                  <p className="mb-0 d-flex justify-content-center "><span
                    className="legend bg-background2"></span>Cancelled</p>
                  <h3 className="mb-1 fw-bold">3467</h3>
                  <div className="d-flex justify-content-center ">
                    <p className="text-muted mb-0">Last 6 months</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={4} md={12}>
          <Card className="custom-card overflow-hidden">
            <Card.Header>
              <div>
                <h3 className="card-title">Timeline</h3>
              </div>
            </Card.Header>
            <Card.Body className="pb-0 pt-4">
              <div className="activity1">
                <div className="activity-blog">
                  <div className="activity-img rounded-circle bg-primary-transparent text-primary">
                    <i className="ri-user-add-fill fs-20"></i>
                  </div>
                  <div className="activity-details d-flex">
                    <div><b><span className="text-dark"> Mr John </span> </b> Started following you
                      <span className="d-flex text-muted fs-11">01 June 2020</span>
                    </div>
                    <div className="ms-auto fs-13 text-dark fw-semibold"><span className="badge bg-primary text-fixed-white">1m</span></div>
                  </div>
                </div>
                <div className="activity-blog">
                  <div className="activity-img rounded-circle bg-secondary-transparent text-secondary">
                    <i className="ri-chat-1-fill fs-20"></i>
                  </div>
                  <div className="activity-details d-flex">
                    <div><b><span className="text-dark"> Lily </span> </b> 1 Commented applied <span className="d-flex text-muted fs-11">01 July 2020</span> </div>
                    <div className="ms-auto fs-13 text-dark fw-semibold"><span className="badge bg-danger text-fixed-white">3m</span></div>
                  </div>
                </div>
                <div className="activity-blog">
                  <div className="activity-img rounded-circle bg-success-transparent text-success">
                    <i className="ri-thumb-up-fill fs-20"></i>
                  </div>
                  <div className="activity-details d-flex">
                    <div><b><span className="text-dark"> Kevin </span> </b> liked your site <span className="d-flex text-muted fs-11">05 July 2020</span></div>
                    <div className="ms-auto fs-13 text-dark fw-semibold"><span className="badge bg-warning text-fixed-white">5m</span></div>
                  </div>
                </div>
                <div className="activity-blog">
                  <div className="activity-img rounded-circle bg-info-transparent text-info">
                    <i className="ri-mail-fill fs-20"></i>
                  </div>
                  <div className="activity-details d-flex">
                    <div><b><span className="text-dark"> Andrena </span> </b> posted a new article
                      <span className="d-flex text-muted fs-11">09 October 2020</span>
                    </div>
                    <div className="ms-auto fs-13 text-dark fw-semibold"><span className="badge bg-info text-fixed-white">5m</span></div>
                  </div>
                </div>
                <div className="activity-blog">
                  <div className="activity-img rounded-circle bg-danger-transparent text-danger">
                    <i className="ri-shopping-bag-fill fs-20"></i>
                  </div>
                  <div className="activity-details d-flex">
                    <div><b><span className="text-dark"> Sonia </span> </b> Delivery in progress
                      <span className="d-flex text-muted fs-11">12 October 2020</span>
                    </div>
                    <div className="ms-auto fs-13 text-dark fw-semibold"><span className="badge bg-warning text-fixed-white">5m</span></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} md={12}>
          <Card className="custom-card">
            <Card.Header>
              <h4 className="card-title">Browser Usage</h4>
            </Card.Header>
            <Card.Body className="pt-2 pb-2">
              <div className="d-md-flex align-items-center browser-stats">
                <div className="d-sm-flex me-1">
                  <i className="ri-chrome-fill bg-secondary-gradient text-fixed-white me-2 logo-icon"></i>
                  <p className="fs-16 my-auto ">Chrome</p>
                </div>
                <div className="ms-auto my-auto">
                  <div className="d-sm-flex text-end">
                    <span className="my-auto fs-16">35,502</span>
                    <span className="text-success fs-15 ms-3"><i className="fe fe-arrow-up"></i>12.75%</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex align-items-center browser-stats">
                <div className="d-sm-flex me-1">
                  <i className="ri-opera-fill text-fixed-white bg-danger-gradient me-2 logo-icon"></i>
                  <p className="fs-16 my-auto ">Opera</p>
                </div>
                <div className="ms-auto my-auto">
                  <div className="d-sm-flex text-end">
                    <span className="my-auto fs-16">12,563</span>
                    <span className="text-danger fs-15 ms-3"><i className="fe fe-arrow-down"></i>15.12%</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex align-items-center browser-stats">
                <div className="d-sm-flex me-1">
                  <i className="ri-firefox-fill text-fixed-white bg-purple-gradient me-2 logo-icon"></i>
                  <p className="fs-16 my-auto ">IE</p>
                </div>
                <div className="ms-auto my-auto">
                  <div className="d-sm-flex text-end">
                    <span className="my-auto fs-16">14,635</span>
                    <span className="text-success fs-15 ms-3"><i className="fe fe-arrow-up"></i>15,63%</span>
                  </div>
                </div>
              </div>
              <div className="d-md-flex align-items-center browser-stats">
                <div className="d-sm-flex me-1">
                  <i className="ri-edge-fill text-fixed-white bg-info-gradient me-2 logo-icon"></i>
                  <p className="fs-16 my-auto ">Firefox</p>
                </div>
                <div className="ms-auto my-auto">
                  <div className="d-sm-flex text-end">
                    <span className="my-auto fs-16">15,453</span>
                    <span className="text-success fs-15 ms-3"><i className="fe fe-arrow-up"></i>23.70%</span>
                  </div>
                </div>
              </div>

              <div className="d-md-flex align-items-center browser-stats">
                <div className="d-sm-flex me-1">
                  <i className="ri-android-fill text-fixed-white bg-success-gradient me-2 logo-icon"></i>
                  <p className="fs-16 my-auto ">Android</p>
                </div>
                <div className="ms-auto my-auto">
                  <div className="d-sm-flex text-end">
                    <span className="my-auto fs-16">25,364</span>
                    <span className="text-danger fs-15 ms-3"><i className="fe fe-arrow-down"></i>24.37%</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} md={12}>
          <Card className="custom-card">
            <Card.Header>
              <h4 className="card-title">Daily Activity</h4>
            </Card.Header>
            <Card.Body className="pb-0">
              <ul className="task-list">
                <li>
                  <i className="task-icon bg-primary"></i>
                  <h6 className="fs-14">Task Finished<span className="text-muted fs-11 mx-2">29 Oct 2020</span></h6>
                  <p className="text-muted fs-12">Adam Berry finished task on<Link to="#" className="fw-semibold text-primary"> Project Management</Link>
                  </p>
                </li>
                <li>
                  <i className="task-icon bg-secondary"></i>
                  <h6 className="fs-14">New Comment<span className="text-muted fs-11 mx-2">25 Oct
                    2020</span></h6>
                  <p className="text-muted fs-12">Victoria commented on Project <Link to="#" className="fw-semibold text-primary"> AngularJS Template</Link>
                  </p>
                </li>
                <li>
                  <i className="task-icon bg-primary"></i>
                  <h6 className="fs-14">New Comment<span className="text-muted fs-11 mx-2">25 Oct 2020</span></h6>
                  <p className="text-muted fs-12">Victoria commented on Project <Link to="#" className="fw-semibold text-primary"> AngularJS Template</Link>
                  </p>
                </li>
                <li>
                  <i className="task-icon bg-secondary"></i>
                  <h6 className="fs-14">Task Overdue<span className="text-muted fs-11 mx-2">14 Oct 2020</span></h6>
                  <p className="text-muted mb-0 fs-12">Petey Cruiser finished task <Link to="#" className="fw-semibold text-primary"> Integrated management</Link></p>
                </li>
                <li>
                  <i className="task-icon bg-primary"></i>
                  <h6 className="fs-14">Task Overdue<span className="text-muted fs-11 mx-2">29 Oct 2020</span></h6>
                  <p className="text-muted mb-0 fs-12">Petey Cruiser finished task <Link to="#" className="fw-semibold text-primary"> Integrated management</Link></p>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Deals Statistics </div>
            </Card.Header>
            <Card.Body>

              <div className="d-sm-flex mb-4 justify-content-between">
                <div className="my-1">
                  <span className="">Show</span>
                  <div className="btn-group mx-2">
                    <Select options={TableSelect} classNamePrefix="Select2" placeholder='10' />
                  </div>
                  <span className="">Entries</span>
                </div>
                <div className="d-flex flex-wrap gap-2 my-1">
                  <div>
                    <input className="form-control form-control-sm h-35" type="text" placeholder="Search Here" aria-label=".form-control-sm example" />
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle as='a' variant="" id="dropdown-basic" className="no-caret btn btn-primary btn-sm btn-wave waves-effect waves-light">Sort By<i className="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">New</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Popular</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Relevant</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="table-responsive deals-table">
                <table className="table text-nowrap table-hover border table-bordered">
                  <thead className="border-top">
                    <tr>
                      <th className="bg-transparent border-bottom-0 w-5 text-uppercase">S.no</th>
                      <th className="bg-transparent border-bottom-0 text-uppercase">Name</th>
                      <th className="bg-transparent border-bottom-0 text-uppercase">Date</th>
                      <th className="bg-transparent border-bottom-0 text-uppercase">Amount</th>
                      <th className="bg-transparent border-bottom-0 text-uppercase">Status</th>
                      <th className="bg-transparent border-bottom-0 text-uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.map(item => (
                      <tr key={item.id} className="border-bottom">
                        <td className="text-muted fs-15 fw-semibold">{item.id}.</td>
                        <td>
                          <div className="d-flex">
                            <img className="avatar avatar-md rounded-circle mt-1" alt="img" src={ALLImages(item.avatar)} />
                            <div className="ms-2 mt-0 mt-sm-2 d-block">
                              <h6 className="mb-0 fs-14 fw-semibold">{item.name}</h6>
                              <span className="fs-12 text-muted">{item.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted fs-15 fw-semibold">{item.date}</td>
                        <td className="text-muted fs-15 fw-semibold">{item.amount}</td>
                        <td className={`text-${item.status === 'Success' ? 'success' : item.status === 'Cancel' ? 'danger' : 'primary'} fs-15 fw-semibold`}>{item.status}</td>
                        <td>
                          <div className="btn-list">
                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                              <Link className="btn btn-icon btn-primary btn-wave waves-effect waves-light">
                                <i className="ri-pencil-fill lh-1"></i>
                              </Link>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                              <Link className="btn btn-icon btn-danger btn-wave waves-effect waves-light">
                                <i className="ri-delete-bin-7-line lh-1"></i>
                              </Link>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <div className="card-footer">
              <div className="d-flex align-items-center">
                <div> Showing 5 Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                </div>
                <div className="ms-auto">
                  <nav aria-label="Page navigation" className="pagination-style-4">
                    <Pagination className='mb-0'>
                      <Pagination.Item disabled>Prev</Pagination.Item>
                      <Pagination.Item active>{1}</Pagination.Item>
                      <Pagination.Item>{2}</Pagination.Item>
                      <Pagination.Item>Next</Pagination.Item>
                    </Pagination>
                  </nav>
                </div>
              </div>
            </div>
          </Card>
        </Col>

      </Row>

    </div>
  )
}

export default Dashboard
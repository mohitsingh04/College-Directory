import React, { Fragment, useRef, useEffect, useState } from "react";
import { Tab, Card, Row, Col, Nav, Breadcrumb } from "react-bootstrap";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import { API } from "../../services/API";
import Location from "./propertyComponents/Location/Location";
import BasicDetails from "./propertyComponents/BasicDetails/BasicDetails";
import Gallery from "./propertyComponents/Gallery/Gallery";
import Hostel from "./propertyComponents/Hostel/Hostel";
import Amenities from "./propertyComponents/Amenities/Amenities";
import Faqs from "./propertyComponents/Faqs/Faqs";
import Scholarship from "./propertyComponents/Scholarship/Scholarship";
import Announcement from "./propertyComponents/Announcement/Announcement";
import Faculty from "./propertyComponents/Faculty/Faculty";
import Reviews from "./propertyComponents/Reviews/Reviews";
import QuestionAndAnswer from "./propertyComponents/QnA/QuestionAndAnswer";
import StarIcon from '@mui/icons-material/Star';
import OtherDetails from "./propertyComponents/OtherDetails/OtherDetails";
import Seo from "./propertyComponents/SEO/Seo";
import Course from "./propertyComponents/Course/Course";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';
import toast from "react-hot-toast";

export default function ViewProperty() {
    const { uniqueId } = useParams();
    const [property, setProperty] = useState("");
    const [reviews, setReviews] = useState([]);
    const loadingBarRef = useRef(null);
    const [propertyCourseData, setPropertyCourseData] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchTime, setFetchTime] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getAuthUserData = async () => {
            const startTime = performance.now(); // Start time
            try {
                setHandlePermissionLoading(true)
                const { data } = await API.get("/profile");
                setAuthUser(data?.data);

                const endTime = performance.now(); // End time
                setFetchTime(((endTime - startTime) / 1000).toFixed(2)); // Convert to seconds
            } catch (error) {
                toast.error(error.message);
            } finally {
                setHandlePermissionLoading(false)
            }
        }

        getAuthUserData();
    }, []);

    useEffect(() => {
        const getPropertyCourseData = async () => {
            const startTime = performance.now(); // Start time
            try {
                const response = await API.get('/property-course');
                const propertyCourseData = response.data;
                const filterPropertyCourse = propertyCourseData.filter(course => course?.propertyId === Number(uniqueId));
                setPropertyCourseData(filterPropertyCourse);

                const endTime = performance.now(); // End time
                setFetchTime(((endTime - startTime) / 1000).toFixed(2)); // Convert to seconds
            } catch (error) {
                toast.error(error.message);
            }
        }

        getPropertyCourseData();
    }, []);

    const fetchReviews = async () => {
        const startTime = performance.now(); // Start time
        try {
            startLoadingBar();
            const response = await API.get(`/reviews`);
            const filteredReviews = response.data.filter((reviews) => reviews.propertyId === Number(uniqueId));
            setReviews(filteredReviews);

            const endTime = performance.now(); // End time
            setFetchTime(((endTime - startTime) / 1000).toFixed(2)); // Convert to seconds
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            stopLoadingBar();
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [uniqueId]);

    useEffect(() => {
        const getProperty = async () => {
            const startTime = performance.now(); // Start time
            try {
                setLoading(true);
                startLoadingBar();
                const response = await API.get(`/property/${uniqueId}`);
                setProperty(response.data);

                const endTime = performance.now(); // End time
                setFetchTime(((endTime - startTime) / 1000).toFixed(2)); // Convert to seconds
            } catch (error) {
                console.error('Error fetching Property:', error);
            } finally {
                setLoading(false);
                stopLoadingBar();
            }
        };

        getProperty();
    }, []);

    const totalRatings = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    useEffect(() => {
        document.title = "AJ | View Property";
    }, []);

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

    const tabMappings = {
        first: "basic-info",
        second: "location",
        third: "gallery",
        fourth: "hostel",
        fifth: "amenities",
        sixth: "faqs",
        seventh: "scholarship",
        eighth: "announcement",
        ninth: "faculty",
        tenth: "reviews",
        eleventh: "qna",
        twelfth: "others",
        thirteenth: "seo",
        fourteenth: "courses"
    };

    // Reverse mapping for getting eventKey from hash
    const reverseTabMappings = Object.fromEntries(
        Object.entries(tabMappings).map(([key, value]) => [value, key])
    );

    const [activeTab, setActiveTab] = useState("first");

    useEffect(() => {
        const hash = location.hash.replace("#", ""); // Get hash without #
        if (reverseTabMappings[hash]) {
            setActiveTab(reverseTabMappings[hash]); // Set active tab from hash
        }
    }, [location.hash]);

    const handleSelect = (eventKey) => {
        setActiveTab(eventKey);
        navigate(`#${tabMappings[eventKey]}`); // Update URL hash
    };

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div>
                    <h1 className="page-title fw-semibold fs-20 mb-0">View Property</h1>
                    <Breadcrumb className='mb-0'>
                        <Breadcrumb.Item>
                            <Link to="/dashboard">Dashboard</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/dashboard/property">Property</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>View</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Row id="user-profile">
                <Col lg={12}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={activeTab} onSelect={handleSelect}>
                        <Card className="custom-card">
                            <Card.Body>
                                <div className="wideget-user">
                                    <Row>
                                        <Col lg={12} md={12} xl={6}>
                                            <div className="wideget-user-desc d-sm-flex">
                                                {loading ? (
                                                    <Skeleton width={94} height={94} className="rounded-circle me-2" />
                                                ) : (
                                                    <div className="wideget-user-img">
                                                        {property.logo !== "image.png"
                                                            ?
                                                            <img src={`${import.meta.env.VITE_API_URL}${property?.logo}`} width={94} height={94} alt="Logo Preview" />
                                                            :
                                                            <img className="" src={ALLImages('face8')} alt="img" />
                                                        }
                                                    </div>
                                                )}
                                                <div className="user-wrap mt-auto ms-3">
                                                    {loading ? (
                                                        <>
                                                            <Skeleton width={280} height={24} className="mb-2" />
                                                            <Skeleton width={180} />
                                                            <Skeleton width={180} />
                                                            <Skeleton width={180} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <h4>{property.property_name} <span className="text-gray-700">({property.short_name})</span></h4>
                                                            <p style={{ fontSize: "16px" }}><StarIcon style={{ color: "#faaf00" }} fontSize="inherit" /> {averageRating !== 0 ? `${averageRating}/5` : 'No reviews yet'} ({reviews?.length} Reviews)</p>
                                                            <Link to="#" className="btn btn-success mt-1 mb-1 me-1">
                                                                <div className="">
                                                                    {property?.status === "Active"
                                                                        ? <span className="badge bg-success">Active</span>
                                                                        : property?.status === "Suspended"
                                                                            ? <span className="badge bg-danger">Suspended</span>
                                                                            : property?.status === "Pending"
                                                                                ? <span className="badge bg-warning">Pending</span>
                                                                                : <span className="badge bg-secondary">Unknown</span>
                                                                    }
                                                                </div>
                                                            </Link>
                                                            {/* <Link to="#" className="btn btn-primary mt-1 mb-1 me-1"><i className="fa fa-rss"></i> <span>Fetched Time: {fetchTime} sec</span></Link> */}
                                                            <Link to={`${import.meta.env.BASE_URL}pages/mailcompose/`} className="btn btn-secondary mt-1 mb-1"><i className="fa fa-envelope"></i> Broucher</Link>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={12} md={12} xl={6}>
                                            <div className="text-xl-right mt-4 mt-xl-0">
                                                <Link to={`/dashboard/property`} className="btn btn-primary">
                                                    <i className="fe fe-arrow-left"></i> Back
                                                </Link>
                                            </div>
                                            <div className="mt-4">
                                                <div className="main-profile-contact-list float-lg-end d-lg-flex">
                                                    {loading ? (
                                                        <>
                                                            <div className="me-5 mt-5 mt-md-0">
                                                                <Skeleton width={100} />
                                                                <Skeleton width={100} height={26} />
                                                            </div>
                                                            <div className="me-5 mt-5 mt-md-0">
                                                                <Skeleton width={100} />
                                                                <Skeleton width={100} height={26} />
                                                            </div>
                                                            <div className="me-0 mt-5 mt-md-0">
                                                                <Skeleton width={100} />
                                                                <Skeleton width={100} height={26} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="me-5">
                                                                <div className="media">
                                                                    <div className="media-icon bg-primary  me-3 mt-1">
                                                                        <i className="fe fe-file-plus fs-20"></i>
                                                                    </div>
                                                                    <div className="media-body">
                                                                        <span className="text-muted">Posts</span>
                                                                        <div className="fw-semibold fs-25">
                                                                            328
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="me-5 mt-5 mt-md-0">
                                                                <div className="media">
                                                                    <div className="media-icon bg-success me-3 mt-1">
                                                                        <i className="fe fe-users  fs-20"></i>
                                                                    </div>
                                                                    <div className="media-body">
                                                                        <span className="text-muted">Followers</span>
                                                                        <div className="fw-semibold fs-25">
                                                                            937k
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="me-0 mt-5 mt-md-0">
                                                                <div className="media">
                                                                    <div className="media-icon bg-orange me-3 mt-1">
                                                                        <i className="fe fe-wifi fs-20"></i>
                                                                    </div>
                                                                    <div className="media-body">
                                                                        <span className="text-muted">Courses</span>
                                                                        <div className="fw-semibold fs-25">
                                                                            {propertyCourseData?.length}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                            <div className="border-top">
                                <div className="wideget-user-tab">
                                    <div className="tab-menu-heading">
                                        <div className="tabs-menu1">
                                            {loading ? (
                                                <>
                                                    <Nav as='ul' variant="pills" className="nav-style-3">
                                                        <Nav.Item as='li'><Nav.Link eventKey="first"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="second"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="third"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="fourth"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="fifth"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="sixth"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="seventh"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="eighth"><Skeleton width={90} height={30} /></Nav.Link></Nav.Item>
                                                    </Nav>
                                                </>
                                            ) : (
                                                <>
                                                    {/* <Nav as='ul' variant="pills" className="nav-style-3">
                                                        <Nav.Item as='li'><Nav.Link eventKey="first">Basic Info.</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="second">Location</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="third">Gallery</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="fourth">Hostel</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="fifth">Amenities</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="sixth">Faq's</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="seventh">Scholarship</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="eighth">Announcement</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="ninth">Faculty</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="tenth">Reviews</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="eleventh">QnA</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="twelfth">Others</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="thirteenth">Seo</Nav.Link></Nav.Item>
                                                        <Nav.Item as='li'><Nav.Link eventKey="fourteenth">Courses</Nav.Link></Nav.Item>
                                                    </Nav> */}
                                                    <Nav as="ul" variant="pills" className="nav-style-3">
                                                        {Object.entries(tabMappings).map(([eventKey, hash]) => (
                                                            <Nav.Item as="li" key={eventKey}>
                                                                <Nav.Link eventKey={eventKey}>{hash.replace("-", " ")}</Nav.Link>
                                                            </Nav.Item>
                                                        ))}
                                                    </Nav>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Tab.Content>
                            <Tab.Pane className="p-0 border-0" eventKey="first">
                                <BasicDetails />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="second">
                                <Location />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="third">
                                <Gallery />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="fourth">
                                <Hostel />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="fifth">
                                <Amenities />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="sixth">
                                <Faqs />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="seventh">
                                <Scholarship />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="eighth">
                                <Announcement />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="ninth">
                                <Faculty />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="tenth">
                                <Reviews />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="eleventh">
                                <QuestionAndAnswer />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="twelfth">
                                <OtherDetails />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="thirteenth">
                                <Seo />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="fourteenth">
                                <Course />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Fragment>
    )
}

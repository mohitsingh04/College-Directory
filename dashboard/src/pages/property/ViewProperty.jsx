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
import AdmissionProcess from "./propertyComponents/Admission Process/AdmissionProcess";
import LoanProcess from "./propertyComponents/Loan Process/LoanProcess";

export default function ViewProperty() {
    const navigate = useNavigate();
    const location = useLocation();
    const { uniqueId } = useParams();
    const loadingBarRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [property, setProperty] = useState("");
    const [authUser, setAuthUser] = useState(null);
    const [propertyCourseData, setPropertyCourseData] = useState([]);
    const [handlePermissionLoading, setHandlePermissionLoading] = useState(false);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getAuthUserData = async () => {
            setLoading(true);
            startLoadingBar();
            setHandlePermissionLoading(true)
            try {
                const { data } = await API.get("/profile");
                setAuthUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
                stopLoadingBar();
                setHandlePermissionLoading(false)
            }
        }

        getAuthUserData();
    }, []);

    useEffect(() => {
        const getPropertyCourseData = async () => {
            setLoading(true);
            startLoadingBar();
            try {
                const response = await API.get('/property-course');
                const propertyCourseData = response.data;
                const filterPropertyCourse = propertyCourseData.filter(course => course?.propertyId === Number(uniqueId));
                setPropertyCourseData(filterPropertyCourse);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
                stopLoadingBar();
            }
        }

        getPropertyCourseData();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        startLoadingBar();
        try {
            const response = await API.get(`/reviews`);
            const filteredReviews = response.data.filter((reviews) => reviews.propertyId === Number(uniqueId));
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
            stopLoadingBar();
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [uniqueId]);

    useEffect(() => {
        const getProperty = async () => {
            setLoading(true);
            startLoadingBar();
            try {
                const response = await API.get(`/property/${uniqueId}`);
                setProperty(response.data);
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

    const tabMapping = [
        { id: "info", label: "Info" },
        { id: "location", label: "Location" },
        { id: "gallery", label: "Gallery" },
        { id: "hostel", label: "Hostel" },
        { id: "amenities", label: "Amenities" },
        { id: "faqs", label: "Faq's" },
        { id: "scholarship", label: "Scholarship" },
        { id: "announcement", label: "Announcement" },
        { id: "faculty", label: "Faculty" },
        { id: "reviews", label: "Reviews" },
        { id: "qna", label: "QnA" },
        { id: "others", label: "Ranks & Others" },
        { id: "seo", label: "Seo" },
        { id: "courses", label: "Courses" },
        { id: "admission-process", label: "Admission Process" },
        { id: "loan-process", label: "Loan Process" },

    ];

    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const handleSelect = (tabId) => {
        setActiveTab(tabId);
        navigate(`/dashboard/property/view/${uniqueId}?tab=${tabId}`);
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
                                                    <div className="">
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
                                                                            123
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
                                                    <Nav as="ul" variant="pills" className="nav-style-3" activeKey={activeTab} onSelect={handleSelect}>
                                                        {tabMapping.map((tab) => (
                                                            <Nav.Item as="li" key={tab.id}>
                                                                <Nav.Link eventKey={tab.id}>
                                                                    {tab.label}
                                                                </Nav.Link>
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
                            <Tab.Pane className="p-0 border-0" eventKey="info">
                                <BasicDetails />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="location">
                                <Location />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="gallery">
                                <Gallery />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="hostel">
                                <Hostel />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="amenities">
                                <Amenities />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="faqs">
                                <Faqs />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="scholarship">
                                <Scholarship />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="announcement">
                                <Announcement />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="faculty">
                                <Faculty />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="reviews">
                                <Reviews />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="qna">
                                <QuestionAndAnswer />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="others">
                                <OtherDetails />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="seo">
                                <Seo />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="courses">
                                <Course />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="admission-process">
                                <AdmissionProcess />
                            </Tab.Pane>
                            <Tab.Pane className="p-0 border-0" eventKey="loan-process">
                                <LoanProcess />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Fragment>
    )
}

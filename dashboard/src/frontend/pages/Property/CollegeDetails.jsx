import React, { Fragment, useEffect, useState, useRef } from "react";
import { Tab, Card, Row, Col, Nav, Breadcrumb, Button, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../../services/API";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Skeleton from "react-loading-skeleton";
import StarIcon from '@mui/icons-material/Star';
import LoadingBar from 'react-top-loading-bar';
import BasicInfo from "./PropertyComponents/BasicInfo/BasicInfo";
import Courses from "./PropertyComponents/Courses/Courses";
import Gallery from "./PropertyComponents/Gallery/Gallery";
import Hostel from "./PropertyComponents/Hostel/Hostel";
import Admission from "./PropertyComponents/Admission/Admission";
import Faqs from "./PropertyComponents/Faqs/Faqs";
import Scholarship from "./PropertyComponents/Scholarship/Scholarship";
import Announcement from "./PropertyComponents/Announcement/Announcement";
import Faculty from "./PropertyComponents/Faculty/Faculty";
import Reviews from "./PropertyComponents/Reviews/Reviews";
import QnA from "./PropertyComponents/Gallery/QnA/QnA";
import toast from "react-hot-toast";
import { IoMdPin } from "react-icons/io";
import DownloadBrocure from "../../components/ModalForm/DownloadBrocure";

export default function CollegeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { collegeId } = useParams();
    const [property, setProperty] = useState("");
    const [propertyLocation, setPropertyLocation] = useState("");
    const [reviews, setReviews] = useState([]);
    const loadingBarRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/property/${collegeId}`);
                setProperty(response.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProperty();
    }, [collegeId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            startLoadingBar();
            const response = await API.get(`/reviews`);
            const filteredReviews = response.data.filter((reviews) => reviews.propertyId === Number(collegeId));
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            stopLoadingBar();
            setLoading(false);
        }
    };

    const fetchLocation = async () => {
        try {
            setLoading(true);
            startLoadingBar();
            const response = await API.get(`/location`);
            const filteredLocation = response.data.filter((location) => location.propertyId === Number(collegeId));
            setPropertyLocation(filteredLocation);
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            stopLoadingBar();
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchLocation();
    }, [collegeId]);

    const totalRatings = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    const tabs = [
        { key: "first", label: "Info" },
        { key: "second", label: "Courses & Fees" },
        { key: "third", label: "Gallery" },
        { key: "fourth", label: "Hostel" },
        { key: "fifth", label: "Admission" },
        { key: "sixth", label: "Faq's" },
        { key: "seventh", label: "Scholarship" },
        { key: "eighth", label: "Announcement" },
        { key: "ninth", label: "Faculty" },
        { key: "tenth", label: "Reviews" },
        { key: "eleventh", label: "QnA" },
    ];

    const tabMapping = {
        "#info": "first",
        "#courses": "second",
        "#gallery": "third",
        "#hostel": "fourth",
        "#admission": "fifth",
        "#faqs": "sixth",
        "#scholarship": "seventh",
        "#announcement": "eighth",
        "#faculty": "ninth",
        "#reviews": "tenth",
        "#qna": "eleventh"
    };

    const [activeTab, setActiveTab] = useState(tabMapping[location.hash] || "first");

    useEffect(() => {
        if (location.hash && tabMapping[location.hash]) {
            setActiveTab(tabMapping[location.hash]);
        }
    }, [location.hash]);

    const handleSelect = (selectedKey) => {
        const selectedHash = Object.keys(tabMapping).find(key => tabMapping[key] === selectedKey);

        if (selectedHash) {
            navigate(selectedHash);
        }
    };

    return (
        <Fragment>
            <Navbar />
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <section className="container">
                <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                    <div>
                        {/* <h1 className="page-title fw-semibold fs-20 mb-0">View Property</h1> */}
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to="/">Home</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {!loading ? (
                                    <Link to="/dashboard/property">{property?.property_type}</Link>
                                ) : (
                                    <Skeleton width={52} />
                                )}
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>
                                {!loading ? (
                                    <>{property?.property_name}</>
                                ) : (
                                    <Skeleton width={136} />
                                )}
                            </Breadcrumb.Item>
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
                                                    {!loading ? (
                                                        <>
                                                            <div>
                                                                {property.logo !== "image.png" ? (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_API_URL}${property?.logo}`}
                                                                        width={94}
                                                                        height={94}
                                                                        alt="Logo Preview"
                                                                    />
                                                                ) : (
                                                                    <img src={ALLImages("face8")} alt="img" />
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Skeleton width={51} height={51} className="me-2" />
                                                    )}
                                                    <div className="user-wrap mt-auto ms-3">
                                                        {!loading ? (
                                                            <>
                                                                <h4>
                                                                    {property.property_name} -{" "}
                                                                    <span className="text-gray-700">[{property.short_name}]</span>
                                                                </h4>
                                                                <p>
                                                                    <IoMdPin />
                                                                    {`${propertyLocation[0]?.city}, ${propertyLocation[0]?.state}`} |{" "}
                                                                    {property ? (property?.college_or_university_type[0]?.value) : null} |{" "}
                                                                    {Array.isArray(property?.affiliated_by)
                                                                        ? property.affiliated_by.map((item) => item.value).join(", ")
                                                                        : "N/A"}{" "}
                                                                    {"Approved"}
                                                                </p>
                                                                <div className="fw-bolder">
                                                                    <Link to={`#reviews`} className="cursor-pointer hover:underline transition-all duration-300">
                                                                        <StarIcon style={{ color: "#faaf00" }} fontSize="inherit" />{" "}
                                                                        {averageRating !== 0 ? `${averageRating}/5` : "No reviews yet"} (
                                                                        {reviews?.length} Reviews){" "}
                                                                    </Link>
                                                                    |{" "}
                                                                    <span className="fw-normal cursor-pointer">
                                                                        <i className="fe fe-check-circle"></i>Apply Now
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Skeleton width={280} height={30} className="mb-2" />
                                                                <Skeleton width={180} />
                                                                <Skeleton width={180} />
                                                                <Skeleton width={180} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={12} md={12} xl={6}>
                                                <div className="">
                                                    <div className="main-profile-contact-list float-lg-end d-lg-flex">
                                                        {!loading ? (
                                                            <div className="me-0 mt-5 mt-md-0">
                                                                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition" onClick={handleShow}>
                                                                    <i className="fe fe-download me-1"></i>
                                                                    Download Brochure
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="me-0 mt-5 mt-md-0">
                                                                <Skeleton width={155} height={38} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>

                                <div className="border-t border-gray-300 w-full px-4 py-3">
                                    <div className="relative flex items-center">
                                        <div className="w-full px-4">
                                            {loading ? (
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
                                            ) : (
                                                <Nav as='ul' variant="pills" className="nav-style-3">
                                                    <Nav.Item as='li'><Nav.Link eventKey="first">Info</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="second">Courses & Fees</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="third">Gallery</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="fourth">Hostel</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="fifth">Admission</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="sixth">Faq's</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="seventh">Scholarship</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="eighth">Announcement</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="ninth">Faculty</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="tenth">Reviews</Nav.Link></Nav.Item>
                                                    <Nav.Item as='li'><Nav.Link eventKey="eleventh">QnA</Nav.Link></Nav.Item>
                                                </Nav>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Tab.Content>
                                <Tab.Pane className="p-0 border-0" eventKey="first">
                                    <BasicInfo />
                                </Tab.Pane>
                                <Tab.Pane className="p-0 border-0" eventKey="second">
                                    <Courses />
                                </Tab.Pane>
                                <Tab.Pane className="p-0 border-0" eventKey="third">
                                    <Gallery />
                                </Tab.Pane>
                                <Tab.Pane className="p-0 border-0" eventKey="fourth">
                                    <Hostel />
                                </Tab.Pane>
                                <Tab.Pane className="p-0 border-0" eventKey="fifth">
                                    <Admission />
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
                                    <QnA />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
                {/* Modal */}
                <Modal show={show} onHide={handleClose} animation={false} centered size="lg" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h5>
                                Register Now To Download Brochure
                            </h5>
                            <p className="font-semibold" style={{ fontSize: "16px" }}>
                                {`${property.property_name}, ${propertyLocation[0]?.city}`}
                            </p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DownloadBrocure />
                    </Modal.Body>
                </Modal>
            </section>
            <Footer />
        </Fragment>
    )
}

import React, { useState, Fragment, useRef, useEffect } from "react";
import { Tab, Card, Row, Col, Table, Nav, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import ALLImages from "../../common/Imagesdata";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { API } from "../../services/API";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import LoadingBar from 'react-top-loading-bar';

export default function Profile() {
    const [user, setUser] = useState(null);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    useEffect(() => {
        const getUserData = async () => {
            try {
                startLoadingBar();
                const { data } = await API.get("/profile");
                setUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                stopLoadingBar();
            }
        }

        getUserData();
    }, []);

    const [open, setOpen] = useState(false);
    const images = Array.from({ length: 8 }, (_, i) => `media${i + 1}`);

    useEffect(() => {
        document.title = "AJ | Profile";
    }, []);

    return (
        <Fragment>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
                <div className="">
                    <h1 className="page-title fw-semibold fs-20 mb-0">Profile</h1>
                    <div className="">
                        <Breadcrumb className='mb-0'>
                            <Breadcrumb.Item>
                                <Link to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Profile</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            <div>
                <Row id="user-profile">
                    {user ? (
                        <>
                            <Col lg={12}>
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                    <Card className="custom-card">
                                        <Card.Body>
                                            <div className="wideget-user">
                                                <Row>
                                                    <Col lg={12} md={12} xl={6}>
                                                        <div className="wideget-user-desc d-sm-flex">
                                                            <div className="wideget-user-img">
                                                                {user?.profile_image ? (
                                                                    <img src={`${import.meta.env.VITE_API_URL}${user?.profile_image}`} alt="Profile Image Preview" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} width={128} height={128} />
                                                                ) : (
                                                                    <img className="rounded-circle" width={128} height={128} src={ALLImages('face8')} alt="img" />
                                                                )}
                                                            </div>
                                                            <div className="user-wrap mt-auto">
                                                                <h4>{user?.name} <span className="fs-6 text-gray">({user?.role})</span></h4>
                                                                <h6 className="text-muted mb-3">Member Since: November 2017</h6>
                                                                <Link to="#" className="btn btn-primary mt-1 mb-1 me-1"><i className="fa fa-rss"></i> Follow</Link>
                                                                <Link to={`${import.meta.env.BASE_URL}pages/mailcompose/`} className="btn btn-secondary mt-1 mb-1"><i className="fa fa-envelope"></i> E-mail</Link>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col lg={12} md={12} xl={6}>
                                                        <div className="text-xl-right mt-4 mt-xl-0">
                                                            <Link to={`/dashboard/edit-profile`} className="btn btn-primary">Edit Profile</Link>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="main-profile-contact-list float-lg-end d-lg-flex">
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
                                                                            <span className="text-muted">Following</span>
                                                                            <div className="fw-semibold fs-25">
                                                                                2,876
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                                                        <Nav as='ul' variant="pills" className="nav-style-3">
                                                            <Nav.Item as='li'><Nav.Link eventKey="first">Profile</Nav.Link></Nav.Item>
                                                            <Nav.Item as='li'><Nav.Link eventKey="second">Other details</Nav.Link></Nav.Item>
                                                        </Nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                    <Tab.Content>
                                        <Tab.Pane className="p-0 border-0" eventKey="first">
                                            <div id="profile-log-switch">
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="media-heading">
                                                            <h5><strong>Personal Information</strong></h5>
                                                        </div>
                                                        <div className="table-responsive ">
                                                            <table className="table row table-borderless">
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><strong>Full Name :</strong> {user?.name}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Phone :</strong> {user?.phone} </td>
                                                                    </tr>
                                                                </tbody>
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><strong>Email :</strong> {user?.email}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane className="p-0 border-0" eventKey="second">
                                            <div id="profile-log-switch">
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="media-heading">
                                                            <h5><strong>Other Information</strong></h5>
                                                        </div>
                                                        <div className="table-responsive ">
                                                            <table className="table row table-borderless">
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><strong>Address :</strong> {user?.address}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>City :</strong> {user?.city}</td>
                                                                    </tr>
                                                                </tbody>
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><strong>Pincode :</strong> {user?.pincode}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>State :</strong> {user?.state}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane className="p-0 border-0" eventKey="third">
                                            <Row className="mb-4 img-gallery">
                                                {images.map((img, index) => (
                                                    <Col key={index} lg={3} md={3} sm={6} className="col-12">
                                                        <Link to="#" onClick={() => setOpen(true)} className="glightbox card">
                                                            <img src={ALLImages(img)} alt={`image-${index + 1}`} />
                                                        </Link>
                                                    </Col>
                                                ))}
                                                {open && (
                                                    <Lightbox
                                                        open={open}
                                                        close={() => setOpen(false)}
                                                        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]} zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                                                        slides={images.map(imageName => ({ src: ALLImages(imageName) }))}
                                                    />
                                                )}
                                            </Row>
                                        </Tab.Pane>
                                        <Tab.Pane className="p-0 border-0" eventKey="fourth">
                                            <Row>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face8')} alt="avatar-img" />
                                                            <div className="media-body valign-middle">
                                                                <Link to="#" className=" fw-semibold text-dark">John Paige</Link>
                                                                <p className="text-muted mb-0">johan@gmail.com</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-2 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <span className="avatar cover-image avatar-md rounded-circle bg-pink me-3">LQ</span>
                                                            <div className="media-body valign-middle mt-0">
                                                                <Link to="#" className="fw-semibold text-dark">Lillian Quinn</Link>
                                                                <p className="text-muted mb-0">lilliangore</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <span className="avatar cover-image avatar-md rounded-circle me-3 bg-primary flex-none">IH</span>
                                                            <div className="media-body valign-middle mt-0">
                                                                <Link to="#" className="fw-semibold text-dark">Irene Harris</Link>
                                                                <p className="text-muted mb-0">Irene@gmail.com</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face3')} alt="avatar-img" />
                                                            <div className="media-body valign-middle mt-0">
                                                                <Link to="#" className="text-dark fw-semibold">Saureen Bgist</Link>
                                                                <p className="text-muted mb-0">harryuqt</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face2')} alt="avatar-img" />
                                                            <div className="media-body valign-middle mt-0">
                                                                <Link to="#" className="text-dark fw-semibold">Maureen Biologist</Link>
                                                                <p className="text-muted mb-0">harryuqt</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <Card className="border p-0 over-flow-hidden">
                                                        <div className="media card-body media-xs overflow-visible ">
                                                            <span className="avatar cover-image avatar-md rounded-circle me-3 bg-info flex-none">PF</span>
                                                            <div className="media-body valign-middle mt-0">
                                                                <Link to="#" className="fw-semibold text-dark">Paddy O'Furniture.</Link>
                                                                <p className="text-muted mb-0">Paddy@gmail.com</p>
                                                            </div>
                                                            <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                                                                <button className="btn btn-primary" type="button">Follow</button>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Col>
                        </>
                    ) : (
                        <>
                            <Col lg={12}>
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                    <Card className="custom-card">
                                        <Card.Body>
                                            <div className="wideget-user">
                                                <Row>
                                                    <Col lg={12} md={12} xl={6}>
                                                        <div className="wideget-user-desc d-sm-flex">
                                                            <div className="wideget-user-img">
                                                                <Skeleton className="rounded-circle" width={128} height={128} />
                                                            </div>
                                                            <div className="user-wrap mt-auto ms-4">
                                                                <h4><Skeleton width={225} /></h4>
                                                                <h6 className="text-muted mb-3"><Skeleton width={225} /></h6>
                                                                <Link to="#" className="btn btn-primary mt-1 mb-1 me-1"><i className="fa fa-rss"></i> Follow</Link>
                                                                <Link to={`${import.meta.env.BASE_URL}pages/mailcompose/`} className="btn btn-secondary mt-1 mb-1"><i className="fa fa-envelope"></i> E-mail</Link>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col lg={12} md={12} xl={6}>
                                                        <div className="text-xl-right mt-4 mt-xl-0">
                                                            <Link to={`/dashboard/edit-profile`} className="btn btn-primary">Edit Profile</Link>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="main-profile-contact-list float-lg-end d-lg-flex">
                                                                <div className="me-5">
                                                                    <div className="media">
                                                                        <div className="media-icon bg-primary  me-3 mt-1">
                                                                            <i className="fe fe-file-plus fs-20"></i>
                                                                        </div>
                                                                        <div className="media-body">
                                                                            <span className="text-muted">Posts</span>
                                                                            <div className="fw-semibold fs-25">
                                                                                <Skeleton width={63} />
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
                                                                                <Skeleton width={63} />
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
                                                                            <span className="text-muted">Following</span>
                                                                            <div className="fw-semibold fs-25">
                                                                                <Skeleton width={63} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                                                        <Nav as='ul' variant="pills" className="nav-style-3">
                                                            <Nav.Item as='li'><Nav.Link eventKey="first"><Skeleton width={80} height={25} /></Nav.Link></Nav.Item>
                                                            <Nav.Item as='li'><Nav.Link eventKey="second"><Skeleton width={80} height={25} /></Nav.Link></Nav.Item>
                                                        </Nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                    <Tab.Content>
                                        <Tab.Pane className="p-0 border-0" eventKey="first">
                                            <div id="profile-log-switch">
                                                <Card className="custom-card">
                                                    <Card.Body>
                                                        <div className="media-heading">
                                                            <h5><strong><Skeleton width={200} height={25} /></strong></h5>
                                                        </div>
                                                        <div className="table-responsive ">
                                                            <table className="table row table-borderless">
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><Skeleton width={200} height={25} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><Skeleton width={200} height={25} /></td>
                                                                    </tr>
                                                                </tbody>
                                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                                    <tr>
                                                                        <td><Skeleton width={200} height={25} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><Skeleton width={200} height={25} /></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <Skeleton count={3} />
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                            </Col>
                        </>
                    )}
                </Row>
            </div>
        </Fragment>
    )
};
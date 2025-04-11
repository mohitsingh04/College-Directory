import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import PropertyImage from './PropertyImage';
import EditBasicDetails from './EditBasicDetails';
import OtherBasicInformation from '../OtherBasicInformation/OtherBasicInformation';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';

export default function BasicDetails() {
    const { uniqueId } = useParams();
    const [property, setProperty] = useState("");
    const [toggleBasicDetailsPage, setToggleBasicDetailsPage] = useState(true);
    const [toggleOtherBasicDetailsPage, setToggleOtherBasicDetailsPage] = useState(true);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const getAuthUserData = async () => {
            try {
                const { data } = await API.get("/profile");
                setAuthUser(data?.data);
            } catch (error) {
                toast.error(error.message);
            }
        }

        getAuthUserData();
    }, []);

    useEffect(() => {
        const getProperty = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/property/${uniqueId}`);
                setProperty(response.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getProperty();
    }, []);

    const handleHideBasicDetailsPage = () => {
        setToggleBasicDetailsPage(false);
    }

    const handleShowBasicDetailsPage = () => {
        setToggleBasicDetailsPage(true);
    }

    const handleHideOtherBasicDetailsPage = () => {
        setToggleOtherBasicDetailsPage(false);
    }

    const handleShowOtherBasicDetailsPage = () => {
        setToggleOtherBasicDetailsPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className="flex justify-between">
                        <div className="media-heading">
                            <h5>
                                {toggleBasicDetailsPage
                                    ?
                                    <strong>Basic Information</strong>
                                    :
                                    <strong>Edit Basic Information</strong>
                                }
                            </h5>
                        </div>
                        <div className=''>
                            {toggleBasicDetailsPage
                                ?
                                <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideBasicDetailsPage}>
                                    <i className="fe fe-edit"></i>
                                </button>
                                :
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowBasicDetailsPage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {toggleBasicDetailsPage
                            ?
                            <>
                                {loading ? (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table row table-borderless">
                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                    <tr>
                                                        <Skeleton width={200} height={20} />
                                                    </tr>
                                                    <tr>
                                                        <Skeleton width={200} height={20} className='mt-3' />
                                                    </tr>
                                                    <tr>
                                                        <Skeleton width={200} height={20} className='mt-3' />
                                                    </tr>
                                                    <tr>
                                                        <Skeleton width={200} height={20} className='mt-3' />
                                                    </tr>
                                                </tbody>
                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                    <tr>
                                                        <Skeleton width={200} height={20} />
                                                    </tr>
                                                    <tr>
                                                        <Skeleton width={200} height={20} className='mt-3' />
                                                    </tr>
                                                    <tr>
                                                        <Skeleton width={450} height={20} className='mt-3' />
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>

                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <table className="table row table-borderless">
                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                    <tr>
                                                        <td><strong>Full Name :</strong> {property.property_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Phone Number :</strong> +{property.phone_number}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Year of Establishment :</strong> {property.established_year}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>College or University Type : </strong>
                                                            {Array.isArray(property?.college_or_university_type) ? (
                                                                property.college_or_university_type.map((item, index) => (
                                                                    <span key={index}>
                                                                        {item.value}
                                                                        {index < property.college_or_university_type.length - 1 ? ", " : ""}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                "N/A"
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {authUser?.role === "Super Admin" || authUser?.role === "Admin" ? (
                                                        <tr>
                                                            <td><strong>Status :</strong> {property.status}</td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                                <tbody className="col-lg-12 col-xl-6 p-0">
                                                    <tr>
                                                        <td><strong>Short Name :</strong> {property.short_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Alternate Phone Number :</strong> +{property.alt_phone_number || "N/A"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Email :</strong> {property.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <strong>Affiliated By:</strong>{" "}
                                                            {Array.isArray(property?.affiliated_by) ? (
                                                                property.affiliated_by.map((item, index) => (
                                                                    <span key={index}>
                                                                        {item.value}
                                                                        {index < property.affiliated_by.length - 1 ? ", " : ""}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                "N/A"
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </>
                            :
                            <EditBasicDetails />
                        }
                    </Card.Body>
                </Card>
                <Card className="custom-card">
                    <Card.Header>
                        <div className="media-heading">
                            <h5>
                                <strong>Logo & Featured Image</strong>
                            </h5>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PropertyImage />
                    </Card.Body>
                </Card>
                <OtherBasicInformation />
            </div>
        </div>
    );
}

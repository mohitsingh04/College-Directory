import React, { useEffect, useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AddOtherDetails from './AddOtherDetails';
import EditOtherDetails from './EditOtherDetails';
import { API } from '../../../../services/API';

export default function OtherDetails() {
    const [toggleOtherDetailsPage, setToggleOtherDetailsPage] = useState(true);
    const { uniqueId } = useParams();
    const [OtherDetails, setOtherDetails] = useState([]);
    const [isExpandedNaac, setIsExpandedNaac] = useState(false);
    const [isExpandedNirf, setIsExpandedNirf] = useState(false);
    const [isExpandedNba, setIsExpandedNba] = useState(false);
    const [isExpandedAJRanking, setIsExpandedAJRanking] = useState(false);

    const toggleReadMoreNaac = () => {
        setIsExpandedNaac(!isExpandedNaac);
    };

    const toggleReadMoreNirf = () => {
        setIsExpandedNirf(!isExpandedNirf);
    };

    const toggleReadMoreNba = () => {
        setIsExpandedNba(!isExpandedNba);
    };

    const toggleReadMoreAJRanking = () => {
        setIsExpandedAJRanking(!isExpandedAJRanking);
    };

    useEffect(() => {
        const fetchOtherDetails = async () => {
            try {
                const response = await API.get(`/other-details`);
                const filteredOtherDetails = response.data.filter((OtherDetails) => OtherDetails.propertyId === Number(uniqueId));
                setOtherDetails(filteredOtherDetails);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        fetchOtherDetails();
    }, [uniqueId]);

    const handleHideOtherDetailsPage = () => {
        setToggleOtherDetailsPage(false);
    }

    const handleShowOtherDetailsPage = () => {
        setToggleOtherDetailsPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header>
                        <div className="media-heading">
                            <h5>
                                {OtherDetails.length > 0
                                    ?
                                    toggleOtherDetailsPage
                                        ?
                                        <strong>Other Details</strong>
                                        :
                                        <strong>Edit Other Details</strong>
                                    :
                                    <strong>Add Other Details</strong>
                                }
                            </h5>
                        </div>
                        <div className='ms-auto'>
                            {OtherDetails.length > 0
                                ?
                                toggleOtherDetailsPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideOtherDetailsPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowOtherDetailsPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {OtherDetails.length > 0
                            ?
                            toggleOtherDetailsPage
                                ?
                                <>
                                    <Row>
                                        <Col md={6} className="my-3">
                                            <strong>Bengal Credit Card</strong>
                                            <br />
                                            {OtherDetails[0]?.bengal_credit_card === true ? "Yes" : "No"}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>CUET</strong>
                                            <br />
                                            {OtherDetails[0]?.cuet === true ? "Yes" : "No"}
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h4>NAAC :</h4>
                                            <p
                                                style={{ fontSize: "14px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: OtherDetails[0]?.naac
                                                }}
                                            />
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h4>NIRF :</h4>
                                            {OtherDetails[0]?.nirf.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpandedNirf
                                                                ? OtherDetails[0]?.nirf
                                                                : OtherDetails[0]?.nirf.substring(0, 1300) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMoreNirf} className="text-blue-700 underline">
                                                        {isExpandedNirf ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: OtherDetails[0]?.nirf
                                                    }}
                                                />
                                            }
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h4>NBA :</h4>
                                            {OtherDetails[0]?.nba.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpandedNba
                                                                ? OtherDetails[0]?.nba
                                                                : OtherDetails[0]?.nba.substring(0, 1300) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMoreNba} className="text-blue-700 underline">
                                                        {isExpandedNba ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: OtherDetails[0]?.nba
                                                    }}
                                                />
                                            }
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h4>AJ Ranking :</h4>
                                            {OtherDetails[0]?.aj_ranking.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpandedAJRanking
                                                                ? OtherDetails[0]?.aj_ranking
                                                                : OtherDetails[0]?.aj_ranking.substring(0, 1300) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMoreAJRanking} className="text-blue-700 underline">
                                                        {isExpandedAJRanking ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: OtherDetails[0]?.aj_ranking
                                                    }}
                                                />
                                            }
                                        </Col>
                                    </Row>
                                </>
                                :
                                <EditOtherDetails
                                    setOtherDetails={setOtherDetails}
                                    setToggleOtherDetailsPage={setToggleOtherDetailsPage}
                                />
                            :
                            <AddOtherDetails
                                setOtherDetails={setOtherDetails}
                                setToggleOtherDetailsPage={setToggleOtherDetailsPage}
                            />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

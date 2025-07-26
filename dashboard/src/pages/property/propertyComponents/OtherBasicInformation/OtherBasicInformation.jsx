import React, { useEffect, useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AddOtherBasicInformation from './AddOtherBasicInformation';
import EditOtherBasicInformation from './EditOtherBasicInformation';
import { API } from '../../../../services/API';
import Skeleton from 'react-loading-skeleton';

export default function OtherBasicInformation() {
    const [toggleOtherBasicInformationPage, setToggleOtherBasicInformationPage] = useState(true);
    const { uniqueId } = useParams();
    const [otherBasicInformation, setOtherBasicInformation] = useState([]);
    const [isExpandedShortDescription, setIsExpandedShortDescription] = useState(false);
    const [isExpandedFullDescription, setIsExpandedFullDescription] = useState(false);

    const toggleReadMoreShortDescription = () => {
        setIsExpandedShortDescription(!isExpandedShortDescription);
    };

    const toggleReadMoreFullDescription = () => {
        setIsExpandedFullDescription(!isExpandedFullDescription);
    };

    useEffect(() => {
        const fetchOtherBasicInformation = async () => {
            try {
                const response = await API.get(`/other-basic-details-property/${uniqueId}`);
                setOtherBasicInformation(response?.data);
            } catch (error) {
                console.error('Error fetching other basic information:', error);
            }
        };

        fetchOtherBasicInformation();
    }, [uniqueId]);

    const handleHideOtherBasicInformationPage = () => {
        setToggleOtherBasicInformationPage(false);
    }

    const handleShowOtherBasicInformationPage = () => {
        setToggleOtherBasicInformationPage(true);
    }

    // if (!otherBasicInformation) {
    //     return <Skeleton height={300} />;
    // }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className="flex justify-between">
                        <div className="media-heading">
                            <h5>
                                {otherBasicInformation
                                    ?
                                    toggleOtherBasicInformationPage
                                        ?
                                        <strong>Other Basic Information</strong>
                                        :
                                        <strong>Edit Other Basic Information</strong>
                                    :
                                    <strong>Add Other Basic Information</strong>
                                }
                            </h5>
                        </div>
                        <div className=''>
                            {otherBasicInformation
                                ?
                                toggleOtherBasicInformationPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideOtherBasicInformationPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowOtherBasicInformationPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {otherBasicInformation
                            ?
                            toggleOtherBasicInformationPage
                                ?
                                <>
                                    <Row>
                                        <Col md={6} className="my-3">
                                            <strong>Youtube Link: </strong>
                                            <br />
                                            {otherBasicInformation?.youtube_link || "N/A"}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>Bitly Link</strong>
                                            <br />
                                            {otherBasicInformation?.bitly_link || "N/A"}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>Website</strong>
                                            <br />
                                            {otherBasicInformation?.website_url || "N/A"}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>Brochure</strong>
                                            <br />
                                            {otherBasicInformation?.brochure !== "brochure.pdf" ? (
                                                <u>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.brochure}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Brochure
                                                    </a>
                                                </u>
                                            ) : (
                                                <span>No brochure available</span>
                                            )}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>Hindi Podcast</strong>
                                            <br />
                                            {otherBasicInformation?.hindi_podcast !== "music.mp3" ? (
                                                <u>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.hindi_podcast}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Podcast
                                                    </a>
                                                </u>
                                            ) : (
                                                <span>No Podcast available</span>
                                            )}
                                        </Col>
                                        <Col md={6} className="my-3">
                                            <strong>English Podcast</strong>
                                            <br />
                                            {otherBasicInformation?.english_podcast !== "music.mp3" ? (
                                                <u>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}${otherBasicInformation?.english_podcast}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Podcast
                                                    </a>
                                                </u>
                                            ) : (
                                                <span>No Podcast available</span>
                                            )}
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h5>Short Description :</h5>
                                            {otherBasicInformation?.short_description?.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpandedShortDescription
                                                                ? otherBasicInformation?.short_description
                                                                : otherBasicInformation?.short_description.substring(0, 1500) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMoreShortDescription} className="text-blue-700 underline">
                                                        {isExpandedShortDescription ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: otherBasicInformation?.short_description
                                                    }}
                                                />
                                            }
                                        </Col>
                                        <Col md={12} className="my-3">
                                            <h5>Full Description :</h5>
                                            {otherBasicInformation?.full_description?.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpandedFullDescription
                                                                ? otherBasicInformation?.full_description
                                                                : otherBasicInformation?.full_description.substring(0, 1500) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMoreFullDescription} className="text-blue-700 underline">
                                                        {isExpandedFullDescription ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: otherBasicInformation?.full_description
                                                    }}
                                                />
                                            }
                                        </Col>
                                    </Row>
                                </>
                                :
                                <EditOtherBasicInformation />
                            :
                            <AddOtherBasicInformation />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

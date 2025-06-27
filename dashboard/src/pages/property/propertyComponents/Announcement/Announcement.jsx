import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddAnnouncement from './AddAnnouncement';
import EditAnnouncement from './EditAnnouncement';

export default function Announcement() {
    const [toggleAnnouncementPage, setToggleAnnouncementPage] = useState(true);
    const { uniqueId } = useParams();
    const [announcement, setAnnouncement] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await API.get(`/announcement`);
                const filteredAnnouncement = response.data.filter((announcement) => announcement.propertyId === Number(uniqueId));
                setAnnouncement(filteredAnnouncement);
            } catch (error) {
                console.error('Error fetching announcement:', error);
            }
        };

        fetchAnnouncement();
    }, [uniqueId]);

    const handleHideAnnouncementPage = () => {
        setToggleAnnouncementPage(false);
    }

    const handleShowAnnouncementPage = () => {
        setToggleAnnouncementPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header>
                        <div className="media-heading">
                            <h5>
                                {announcement.length > 0
                                    ?
                                    toggleAnnouncementPage
                                        ?
                                        <strong>Announcement</strong>
                                        :
                                        <strong>Edit Announcement</strong>
                                    :
                                    <strong>Add Announcement</strong>
                                }
                            </h5>
                        </div>
                        <div className='ms-auto'>
                            {announcement.length > 0
                                ?
                                toggleAnnouncementPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideAnnouncementPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowAnnouncementPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {announcement.length > 0
                            ?
                            toggleAnnouncementPage
                                ?
                                <>
                                    {announcement[0].announcement.length >= 1500
                                        ?
                                        <>
                                            <p
                                                style={{ fontSize: "16px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpanded
                                                        ? announcement[0]?.announcement
                                                        : announcement[0]?.announcement.substring(0, 1500) + "...",
                                                }}
                                            />
                                            <button onClick={toggleReadMore} className="text-blue-700 underline">
                                                {isExpanded ? "Read Less" : "Read More"}
                                            </button>
                                        </>
                                        :
                                        <p
                                            style={{ fontSize: "16px" }}
                                            dangerouslySetInnerHTML={{
                                                __html: announcement[0]?.announcement
                                            }}
                                        />
                                    }
                                </>
                                :
                                <EditAnnouncement
                                    setAnnouncement={setAnnouncement}
                                    setToggleAnnouncementPage={setToggleAnnouncementPage}
                                />
                            :
                            <AddAnnouncement
                                setAnnouncement={setAnnouncement}
                                setToggleAnnouncementPage={setToggleAnnouncementPage}
                            />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

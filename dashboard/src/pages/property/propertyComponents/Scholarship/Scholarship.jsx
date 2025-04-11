import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddScholarship from './AddScholarship';
import EditScholarship from './EditScholarship';

export default function Scholarship() {
    const [toggleScholarshipPage, setToggleScholarshipPage] = useState(true);
    const { uniqueId } = useParams();
    const [scholarship, setScholarship] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const response = await API.get(`/scholarship`);
                const filteredScholarship = response.data.filter((scholarship) => scholarship.propertyId === Number(uniqueId));
                setScholarship(filteredScholarship);
            } catch (error) {
                console.error('Error fetching scholarship:', error);
            }
        };

        fetchScholarship();
    }, [uniqueId]);

    const handleHideScholarshipPage = () => {
        setToggleScholarshipPage(false);
    }

    const handleShowScholarshipPage = () => {
        setToggleScholarshipPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className='flex justify-between'>
                        <div className="media-heading">
                            <h5>
                                {scholarship.length > 0
                                    ?
                                    toggleScholarshipPage
                                        ?
                                        <strong>Scholarship</strong>
                                        :
                                        <strong>Edit Scholarship</strong>
                                    :
                                    <strong>Add Scholarship</strong>
                                }
                            </h5>
                        </div>
                        <div>
                            {scholarship.length > 0
                                ?
                                toggleScholarshipPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideScholarshipPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowScholarshipPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {scholarship.length > 0
                            ?
                            toggleScholarshipPage
                                ?
                                <>
                                    {scholarship[0]?.scholarship.length >= 1500
                                        ?
                                        <>
                                            <p
                                                style={{ fontSize: "16px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpanded
                                                        ? scholarship[0]?.scholarship
                                                        : scholarship[0]?.scholarship.substring(0, 1500) + "...",
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
                                                __html: scholarship[0]?.scholarship
                                            }}
                                        />
                                    }
                                </>
                                :
                                <EditScholarship />
                            :
                            <AddScholarship />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

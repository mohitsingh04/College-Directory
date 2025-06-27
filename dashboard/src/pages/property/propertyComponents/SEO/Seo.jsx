import React, { useEffect, useState } from 'react'
import { Card, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AddSeo from './AddSeo';
import EditSeo from './EditSeo';
import { API } from '../../../../services/API';

export default function Seo() {
    const [toggleSeoPage, setToggleSeoPage] = useState(true);
    const { uniqueId } = useParams();
    const [seo, setSeo] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchSeo = async () => {
            try {
                const response = await API.get(`/seo`);
                const filteredSeo = response.data.filter((seo) => seo.propertyId === Number(uniqueId));
                setSeo(filteredSeo);
            } catch (error) {
                console.error('Error fetching seo:', error);
            }
        };

        fetchSeo();
    }, [uniqueId]);

    const handleHideSeoPage = () => {
        setToggleSeoPage(false);
    }

    const handleShowSeoPage = () => {
        setToggleSeoPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header>
                        <div className="media-heading">
                            <h5>
                                {seo.length > 0
                                    ?
                                    toggleSeoPage
                                        ?
                                        <strong>Seo</strong>
                                        :
                                        <strong>Edit Seo</strong>
                                    :
                                    <strong>Add Seo</strong>
                                }
                            </h5>
                        </div>
                        <div className='ms-auto'>
                            {seo.length > 0
                                ?
                                toggleSeoPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideSeoPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowSeoPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {seo.length > 0
                            ?
                            toggleSeoPage
                                ?
                                <>
                                    <Row>
                                        <Col md={6} className='mb-3'>
                                            <strong>Title:</strong>
                                            <br />
                                            {seo[0]?.title}
                                        </Col>
                                        <Col md={6} className='mb-3'>
                                            <strong>Slug:</strong>
                                            <br />
                                            {seo[0]?.slug}
                                        </Col>
                                        <Col md={6} className='mb-3'>
                                            <strong>Primary focus keyword:</strong>
                                            <br />
                                            {Array.isArray(seo[0]?.primary_focus_keywords) ? (
                                                seo[0]?.primary_focus_keywords.map((item, index) => (
                                                    <span key={index}>
                                                        {item.label}
                                                        {index < seo[0]?.primary_focus_keywords.length - 1 ? ", " : ""}
                                                    </span>
                                                ))
                                            ) : (
                                                "N/A"
                                            )}
                                        </Col>
                                        <Col md={12} className='mb-3'>
                                            <strong>Json schema:</strong>
                                            <br />
                                            {seo[0]?.json_schema}
                                        </Col>
                                        <Col md={12} className='mb-3'>
                                            <strong>Description:</strong>
                                            {seo[0]?.description.length >= 1500
                                                ?
                                                <>
                                                    <p
                                                        style={{ fontSize: "14px" }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: isExpanded
                                                                ? seo[0]?.description
                                                                : seo[0]?.description.substring(0, 1300) + "...",
                                                        }}
                                                    />
                                                    <button onClick={toggleReadMore} className="text-blue-700 underline">
                                                        {isExpanded ? "Read Less" : "Read More"}
                                                    </button>
                                                </>
                                                :
                                                <p
                                                    style={{ fontSize: "14px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: seo[0]?.description
                                                    }}
                                                />
                                            }
                                        </Col>
                                    </Row>
                                </>

                                :
                                <EditSeo
                                    setSeo={setSeo}
                                    setToggleSeoPage={setToggleSeoPage}
                                />
                            :
                            <AddSeo
                                setSeo={setSeo}
                                setToggleSeoPage={setToggleSeoPage}
                            />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

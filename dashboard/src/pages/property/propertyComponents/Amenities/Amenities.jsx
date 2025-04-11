import React, { Fragment, useEffect, useState } from 'react'
import AddAmenities from './AddAmenities';
import EditAmenities from './EditAmenities';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';

export default function Amenities() {
    const { uniqueId } = useParams();
    const [toggleAmenitiesPage, setToggleAmenitiesPage] = useState(true);
    const [amenities, setAmenities] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await API.get("/amenities");
                const filteredAmenities = response.data.filter((amenities) => amenities.propertyId === Number(uniqueId));
                setAmenities(filteredAmenities);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchAmenities();
    }, []);

    const handleHideAmenitiesPage = () => {
        setToggleAmenitiesPage(false);
    }

    const handleShowAmenitiesPage = () => {
        setToggleAmenitiesPage(true);
    }

    return (
        <Fragment>
            <Card className="custom-card">
                <Card.Header>
                    <div className="media-heading">
                        <h5>
                            {amenities.length > 0 ? (
                                toggleAmenitiesPage ? (
                                    <strong>Amenities</strong>
                                ) : (
                                    <strong>Edit Amenities</strong>
                                )
                            ) : (
                                <strong>Add Amenities</strong>
                            )}
                        </h5>
                    </div>
                    <div className="ms-auto">
                        {amenities.length > 0 ? (
                            toggleAmenitiesPage ? (
                                <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideAmenitiesPage}>
                                    <i className="fe fe-edit"></i>
                                </button>
                            ) : (
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowAmenitiesPage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            )
                        ) : (
                            null
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    {amenities.length > 0 ? (
                        toggleAmenitiesPage ? (
                            <>
                                {amenities.length > 0 ? (
                                    <div className="row">
                                        {amenities[0]?.selectedAmenities?.map((amenityCategory, index) =>
                                            Object.entries(amenityCategory).map(([category, items]) => (
                                                <div key={index} className="col-md-4">
                                                    <h6 className="font-bold">{category}</h6>
                                                    <ul>
                                                        {Array.isArray(items) &&
                                                            items.map((item, i) =>
                                                                Object.entries(item).map(([key, value]) => (
                                                                    <li key={i}>
                                                                        • {key}{value && value !== true ? `: ${value}` : ""}
                                                                    </li>
                                                                ))
                                                            )}
                                                    </ul>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <p>No amenities available</p>
                                )}

                            </>
                        ) : (
                            <EditAmenities />
                        )
                    ) : (
                        <AddAmenities />
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

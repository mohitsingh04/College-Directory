import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddLocation from './AddLocation';
import EditLocation from './EditLocation';
import LoadingBar from 'react-top-loading-bar';

export default function Location() {
    const [toggleLocationPage, setToggleLocationPage] = useState(true);
    const { uniqueId } = useParams();
    const [location, setLocation] = useState([]);
    const loadingBarRef = useRef(null);

    const startLoadingBar = () => loadingBarRef.current?.continuousStart();
    const stopLoadingBar = () => loadingBarRef.current?.complete();

    const fetchLocation = async () => {
        try {
            startLoadingBar();
            const response = await API.get(`/location-by-property/${uniqueId}`);
            setLocation(response?.data);
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            stopLoadingBar();
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [uniqueId]);

    const handleHideLocationPage = () => {
        setToggleLocationPage(false);
    };

    const handleShowLocationPage = () => {
        setToggleLocationPage(true);
    };

    return (
        <div>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className="flex justify-between">
                        <div className="media-heading">
                            <h5>
                                {location
                                    ? toggleLocationPage
                                        ? <strong>Location</strong>
                                        : <strong>Edit Location</strong>
                                    : <strong>Add Location</strong>}
                            </h5>
                        </div>
                        <div>
                            {location && (
                                toggleLocationPage ? (
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideLocationPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                ) : (
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowLocationPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                )
                            )}
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {location ? (
                            toggleLocationPage ? (
                                <div className="table-responsive">
                                    <table className="table row table-borderless">
                                        <tbody className="col-lg-12 col-xl-6 p-0">
                                            <tr><td><strong>Address :</strong> {location?.address}</td></tr>
                                            <tr><td><strong>Pincode :</strong> {location?.pincode}</td></tr>
                                            <tr><td><strong>Country :</strong> {location?.country}</td></tr>
                                            <tr><td><strong>State :</strong> {location?.state}</td></tr>
                                            <tr><td><strong>City :</strong> {location?.city}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <EditLocation
                                    setLocation={setLocation}
                                    setToggleLocationPage={setToggleLocationPage}
                                />
                            )
                        ) : (
                            <AddLocation
                                setLocation={setLocation}
                                setToggleLocationPage={setToggleLocationPage}
                            />
                        )}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

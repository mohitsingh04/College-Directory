import React, { useEffect, useRef, useState } from 'react'
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

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                startLoadingBar();
                const response = await API.get(`/location`);
                const filteredLocation = response.data.filter((location) => location.propertyId === Number(uniqueId));
                setLocation(filteredLocation);
            } catch (error) {
                console.error('Error fetching location:', error);
            } finally {
                stopLoadingBar();
            }
        };

        fetchLocation();
    }, [uniqueId]);

    const handleHideLocationPage = () => {
        setToggleLocationPage(false);
    }

    const handleShowLocationPage = () => {
        setToggleLocationPage(true);
    }

    return (
        <div>
            <LoadingBar color="#ff5b00" ref={loadingBarRef} />
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className="flex justify-between">
                        <div className="media-heading">
                            <h5>
                                {location.length > 0
                                    ?
                                    toggleLocationPage
                                        ?
                                        <strong>Location</strong>
                                        :
                                        <strong>Edit Location</strong>
                                    :
                                    <strong>Add Location</strong>
                                }
                            </h5>
                        </div>
                        <div>
                            {location.length > 0
                                ?
                                toggleLocationPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideLocationPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowLocationPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {location.length > 0
                            ?
                            toggleLocationPage
                                ?
                                <div className="table-responsive">
                                    <table className="table row table-borderless">
                                        <tbody className="col-lg-12 col-xl-6 p-0">
                                            <tr>
                                                <td><strong>Address :</strong> {location[0]?.address}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>City :</strong> {location[0]?.city}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Country :</strong> India</td>
                                            </tr>
                                        </tbody>
                                        <tbody className="col-lg-12 col-xl-6 p-0">
                                            <tr>
                                                <td><strong>Pincode :</strong> {location[0]?.pincode}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>State :</strong> {location[0]?.state}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <EditLocation />
                            :
                            <AddLocation />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

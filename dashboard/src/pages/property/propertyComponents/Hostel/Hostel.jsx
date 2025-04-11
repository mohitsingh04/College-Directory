import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AddHostel from './AddHostel';
import EditHostel from './EditHostel';
import { API } from '../../../../services/API';

export default function Hostel() {
    const [toggleHostelPage, setToggleHostelPage] = useState(true);
    const { uniqueId } = useParams();
    const [hostel, setHostel] = useState([]);
    const [isExpandedBoysDetails, setIsExpandedBoysDetails] = useState(false);
    const [isExpandedGirlsDetails, setIsExpandedGirlsDetails] = useState(false);

    const toggleReadMoreBoysDetails = () => {
        setIsExpandedBoysDetails(!isExpandedBoysDetails);
    };

    const toggleReadMoreGirlsDetails = () => {
        setIsExpandedGirlsDetails(!isExpandedGirlsDetails);
    };

    useEffect(() => {
        const fetchHostel = async () => {
            try {
                const response = await API.get(`/hostel`);
                const filteredHostel = response.data.filter((hostel) => hostel.propertyId === Number(uniqueId));
                setHostel(filteredHostel);
            } catch (error) {
                console.error('Error fetching hostel:', error);
            }
        };

        fetchHostel();
    }, [uniqueId]);

    const handleHideHostelPage = () => {
        setToggleHostelPage(false);
    }

    const handleShowHostelPage = () => {
        setToggleHostelPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className='flex justify-between'>
                        <div className="media-heading">
                            <h5>
                                {hostel?.length > 0
                                    ?
                                    toggleHostelPage
                                        ?
                                        <strong>Hostel</strong>
                                        :
                                        <strong>Edit Hostel</strong>
                                    :
                                    <strong>Add Hostel</strong>
                                }
                            </h5>
                        </div>
                        <div>
                            {hostel?.length > 0
                                ?
                                toggleHostelPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideHostelPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowHostelPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {hostel?.length > 0
                            ?
                            toggleHostelPage
                                ?
                                <>
                                    <div>
                                        <p><b>Boys Hostel Fees: </b> {hostel[0]?.boys_hostel_fees}</p>
                                        <p><b>Boys Hostel Details : </b> </p>
                                        {hostel[0]?.boys_hostel_description?.length >= 1500
                                            ?
                                            <>
                                                <p
                                                    style={{ fontSize: "16px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: isExpandedBoysDetails
                                                            ? hostel[0]?.boys_hostel_description
                                                            : hostel[0]?.boys_hostel_description.substring(0, 1500) + "...",
                                                    }}
                                                />
                                                <button onClick={toggleReadMoreBoysDetails} className="text-blue-700 underline">
                                                    {isExpandedBoysDetails ? "Read Less" : "Read More"}
                                                </button>
                                            </>
                                            :
                                            <p
                                                style={{ fontSize: "16px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: hostel[0]?.boys_hostel_description
                                                }}
                                            />
                                        }
                                    </div>
                                    <div>
                                        <p><b>Girls Hostel Fees: </b>{hostel[0]?.girls_hostel_fees}</p>
                                        <p><b>Girls Hostel Details : </b></p>
                                        {hostel[0]?.girls_hostel_description?.length >= 1500
                                            ?
                                            <>
                                                <p
                                                    style={{ fontSize: "16px" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: isExpandedGirlsDetails
                                                            ? hostel[0]?.girls_hostel_description
                                                            : hostel[0]?.girls_hostel_description.substring(0, 1500) + "...",
                                                    }}
                                                />
                                                <button onClick={toggleReadMoreGirlsDetails} className="text-blue-700 underline">
                                                    {isExpandedGirlsDetails ? "Read Less" : "Read More"}
                                                </button>
                                            </>
                                            :
                                            <p
                                                style={{ fontSize: "16px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: hostel[0]?.girls_hostel_description
                                                }}
                                            />
                                        }
                                    </div>
                                </>
                                :
                                <EditHostel />
                            :
                            <AddHostel />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

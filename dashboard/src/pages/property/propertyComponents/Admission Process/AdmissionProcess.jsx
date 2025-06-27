import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddAdmissionProcess from './AddAdmissionProcess';
import EditAdmissionProcess from './EditAdmissionProcess';

export default function AdmissionProcess() {
    const [toggleAdmissionProcessPage, setToggleAdmissionProcessPage] = useState(true);
    const { uniqueId } = useParams();
    const [admissionProcess, setAdmissionProcess] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchAdmissionProcess = async () => {
            try {
                const response = await API.get(`/admission-process`);
                const filteredAdmissionProcess = response.data.filter((admissionProcess) => admissionProcess.propertyId === Number(uniqueId));
                setAdmissionProcess(filteredAdmissionProcess);
            } catch (error) {
                console.error('Error fetching admission process:', error);
            }
        };

        fetchAdmissionProcess();
    }, [uniqueId]);

    const handleHideAdmissionProcessPage = () => {
        setToggleAdmissionProcessPage(false);
    }

    const handleShowAdmissionProcessPage = () => {
        setToggleAdmissionProcessPage(true);
    }

    return (
        <div>
            <div id="profile-log-switch">
                <Card className="custom-card">
                    <Card.Header className='flex justify-between'>
                        <div className="media-heading">
                            <h5>
                                {admissionProcess.length > 0
                                    ?
                                    toggleAdmissionProcessPage
                                        ?
                                        <strong>Admission Process</strong>
                                        :
                                        <strong>Edit Admission Process</strong>
                                    :
                                    <strong>Add Admission Process</strong>
                                }
                            </h5>
                        </div>
                        <div>
                            {admissionProcess.length > 0
                                ?
                                toggleAdmissionProcessPage ?
                                    <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideAdmissionProcessPage}>
                                        <i className="fe fe-edit"></i>
                                    </button>
                                    :
                                    <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowAdmissionProcessPage}>
                                        <i className="fe fe-x"></i>
                                    </button>
                                :
                                null
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {admissionProcess.length > 0
                            ?
                            toggleAdmissionProcessPage
                                ?
                                <>
                                    {admissionProcess[0]?.process.length >= 1500
                                        ?
                                        <>
                                            <p
                                                style={{ fontSize: "16px" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: isExpanded
                                                        ? admissionProcess[0]?.process
                                                        : admissionProcess[0]?.process.substring(0, 1500) + "...",
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
                                                __html: admissionProcess[0]?.process
                                            }}
                                        />
                                    }
                                </>
                                :
                                <EditAdmissionProcess
                                    setAdmissionProcess={setAdmissionProcess}
                                    setToggleAdmissionProcessPage={setToggleAdmissionProcessPage}
                                />
                            :
                            <AddAdmissionProcess
                                setAdmissionProcess={setAdmissionProcess}
                                setToggleAdmissionProcessPage={setToggleAdmissionProcessPage}
                            />
                        }
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

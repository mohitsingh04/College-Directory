import React, { Fragment, useEffect, useState } from 'react'
import { Accordion, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddFaqs from './AddFaqs';
import EditFaqs from './EditFaqs';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Faqs() {
    const [toggleFaqsPage, setToggleFaqsPage] = useState(true);
    const { uniqueId } = useParams();
    const [faqs, setFaqs] = useState([]);
    const [faqsUniqueId, setFaqsUniqueId] = useState("");

    const fetchFaqs = async () => {
        try {
            const response = await API.get(`/faqs`);
            const filteredFaqs = response.data.filter((faqs) => faqs.propertyId === Number(uniqueId));
            setFaqs(filteredFaqs);
        } catch (error) {
            console.error('Error fetching faqs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, [uniqueId]);

    const handleHideFaqsPage = () => {
        setToggleFaqsPage(false);
    }

    const handleShowFaqsPage = () => {
        setToggleFaqsPage(true);
    }

    const handleEditFaqs = (id) => {
        setToggleFaqsPage(false);
        setFaqsUniqueId(id);
    };

    const handleDeleteFaqs = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`/faqs/${id}`);
                    toast.success(response.data.message);
                    fetchFaqs();
                } catch (error) {
                    toast.error("Error deleting faqs");
                }
            }
        });
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            {faqs.length > 0
                                ?
                                toggleFaqsPage
                                    ?
                                    <strong>Faqs</strong>
                                    :
                                    <strong>Edit Faqs</strong>
                                :
                                <strong>Faqs</strong>
                            }
                        </h5>
                    </div>
                    <div>
                        {faqs.length > 0
                            ?
                            toggleFaqsPage ?
                                null
                                :
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowFaqsPage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            :
                            null
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    {toggleFaqsPage
                        ?
                        <>
                            {faqs.length > 0 ? (
                                <Accordion id="accordionExample">
                                    {faqs.map((item, index) => (
                                        <div key={index} className="mt-1">
                                            <Accordion.Item eventKey={item.uniqueId}>
                                                <div className="d-flex justify-content-between align-items-center px-2 py-1">
                                                    <Accordion.Header className="flex-grow-1">{item.question}</Accordion.Header>
                                                    <span className='ms-1'>
                                                        <button className="btn btn-primary me-1" title="Edit" onClick={() => handleEditFaqs(item.uniqueId)}>
                                                            <i className="fe fe-edit"></i>
                                                        </button>
                                                        <button className="btn btn-danger" title="Delete" onClick={() => handleDeleteFaqs(item.uniqueId)}>
                                                            <i className="fe fe-trash"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                                <Accordion.Body>
                                                    <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </div>
                                    ))}
                                </Accordion>
                            ) : (
                                <p>No Faqs Found</p>
                            )}
                        </>
                        :
                        <>
                            <EditFaqs faqsUniqueId={faqsUniqueId} />
                        </>
                    }
                </Card.Body>
            </Card>

            {toggleFaqsPage
                ?
                <>
                    <Card>
                        <Card.Header>
                            <div className="media-heading">
                                <h5>
                                    <strong>Add Faqs</strong>
                                </h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <AddFaqs />
                        </Card.Body>
                    </Card>
                </>
                :
                null
            }
        </Fragment>
    );
}

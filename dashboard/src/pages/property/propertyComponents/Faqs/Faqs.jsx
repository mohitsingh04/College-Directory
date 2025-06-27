import React, { Fragment, useEffect, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddFaqs from './AddFaqs';
import EditFaqs from './EditFaqs';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Faqs() {
    const [toggleFaqsPage, setToggleFaqsPage] = useState(true);
    const [showAddFaqForm, setShowAddFaqForm] = useState(false);
    const { uniqueId } = useParams();
    const [faqs, setFaqs] = useState([]);
    const [faqsUniqueId, setFaqsUniqueId] = useState("");

    const fetchFaqs = async () => {
        try {
            const response = await API.get(`/faqs`);
            const filteredFaqs = response.data.filter((faq) => faq.propertyId === Number(uniqueId));
            setFaqs(filteredFaqs);

            if (filteredFaqs.length === 0) {
                setShowAddFaqForm(true);
            } else {
                setShowAddFaqForm(false);
            }
        } catch (error) {
            console.error('Error fetching faqs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, [uniqueId]);

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
                <Card.Header className='flex justify-between items-center'>
                    <div className="media-heading">
                        <h5>
                            <strong>
                                {faqs.length > 0
                                    ? toggleFaqsPage
                                        ? showAddFaqForm
                                            ? "Add Faqs"
                                            : "Faqs"
                                        : "Edit Faqs"
                                    : "Add Faqs"}
                            </strong>
                        </h5>
                    </div>

                    {/* Toggle buttons */}
                    {toggleFaqsPage ? (
                        faqs.length > 0 && (
                            <button
                                className={`btn btn-${showAddFaqForm ? 'danger' : 'primary'} btn-sm`}
                                onClick={() => setShowAddFaqForm(!showAddFaqForm)}
                            >
                                {showAddFaqForm ? <i className="fe fe-x"></i> : <><i className="fe fe-plus"></i> Add Faq</>}
                            </button>
                        )
                    ) : (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                                setToggleFaqsPage(true);
                                setFaqsUniqueId("");
                            }}
                        >
                            <i className="fe fe-x"></i>
                        </button>
                    )}
                </Card.Header>

                <Card.Body>
                    {toggleFaqsPage ? (
                        <>
                            {faqs.length > 0 && !showAddFaqForm ? (
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
                                <AddFaqs
                                    onFaqAdded={() => {
                                        fetchFaqs();
                                        setShowAddFaqForm(false);
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <EditFaqs
                            faqsUniqueId={faqsUniqueId}
                            onFaqUpdated={() => {
                                fetchFaqs();
                                setToggleFaqsPage(true);
                                setFaqsUniqueId("");
                            }}
                        />
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

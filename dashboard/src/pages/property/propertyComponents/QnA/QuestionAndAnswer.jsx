import React, { Fragment, useEffect, useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddQuestionAndAnswer from './AddQuestionAndAnswer';
import EditQuestionAndAnswer from './EditQuestionAndAnswer';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function QuestionAndAnswer() {
    const [toggleQnaPage, setToggleQnaPage] = useState(true);
    const [showAddQnaForm, setShowAddQnaForm] = useState(false);
    const { uniqueId } = useParams();
    const [qnaList, setQnaList] = useState([]);
    const [qnaUniqueId, setQnaUniqueId] = useState("");

    const fetchQnA = async () => {
        try {
            const response = await API.get(`/questionAndAnswer`);
            const filtered = response.data.filter((item) => item.propertyId === Number(uniqueId));
            setQnaList(filtered);

            if (filtered.length === 0) {
                setShowAddQnaForm(true);
            } else {
                setShowAddQnaForm(false);
            }
        } catch (error) {
            console.error('Error fetching QnA:', error);
        }
    };

    useEffect(() => {
        fetchQnA();
    }, [uniqueId]);

    const handleShowQnaPage = () => {
        setToggleQnaPage(true);
        setQnaUniqueId("");
    };

    const handleEditQna = (id) => {
        setToggleQnaPage(false);
        setQnaUniqueId(id);
    };

    const handleDeleteQna = (id) => {
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
                    const response = await API.delete(`/questionAndAnswer/${id}`);
                    toast.success(response.data.message);
                    fetchQnA();
                } catch (error) {
                    toast.error("Error deleting QnA");
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
                            <strong>
                                {qnaList.length > 0
                                    ? toggleQnaPage
                                        ? showAddQnaForm
                                            ? "Add QnA"
                                            : "QnA"
                                        : "Edit QnA"
                                    : "Add QnA"}
                            </strong>
                        </h5>
                    </div>
                    <div>
                        {toggleQnaPage ? (
                            qnaList.length > 0 && (
                                <button
                                    className={`btn btn-${showAddQnaForm ? 'danger' : 'primary'} btn-sm`}
                                    onClick={() => setShowAddQnaForm(!showAddQnaForm)}
                                >
                                    {showAddQnaForm ? (
                                        <i className="fe fe-x"></i>
                                    ) : (
                                        <>
                                            <i className="fe fe-plus"></i> Add QnA
                                        </>
                                    )}
                                </button>
                            )
                        ) : (
                            <button className="btn btn-danger btn-sm" title="Cancel" onClick={handleShowQnaPage}>
                                <i className="fe fe-x"></i>
                            </button>
                        )}
                    </div>
                </Card.Header>

                <Card.Body>
                    {toggleQnaPage ? (
                        showAddQnaForm ? (
                            <AddQuestionAndAnswer
                                onQnaAdded={() => {
                                    fetchQnA();
                                    setShowAddQnaForm(false);
                                }}
                            />
                        ) : qnaList.length > 0 ? (
                            <Accordion id="accordionExample">
                                {qnaList.map((item, index) => (
                                    <div className="mt-1" key={index}>
                                        <Accordion.Item eventKey={item.uniqueId}>
                                            <div className="d-flex justify-content-between align-items-center px-2 py-1">
                                                <Accordion.Header className="flex-grow-1">{item.question}</Accordion.Header>
                                                <span className='ms-1'>
                                                    <button className="btn btn-primary btn-sm me-1" title="Edit" onClick={() => handleEditQna(item.uniqueId)}>
                                                        <i className="fe fe-edit"></i>
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDeleteQna(item.uniqueId)}>
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
                            <p>No QnA Found</p>
                        )
                    ) : (
                        <EditQuestionAndAnswer
                            questionAndAnswerUniqueId={qnaUniqueId}
                            onQnaUpdated={() => {
                                fetchQnA();
                                setToggleQnaPage(true);
                                setQnaUniqueId("");
                            }}
                        />
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}

import React, { Fragment, useEffect, useState } from 'react'
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddQuestionAndAnswer from './AddQuestionAndAnswer';
import EditQuestionAndAnswer from './EditQuestionAndAnswer';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function QuestionAndAnswer() {
    const [toggleQuestionAndAnswerPage, setToggleQuestionAndAnswerPage] = useState(true);
    const { uniqueId } = useParams();
    const [questionAndAnswer, setQuestionAndAnswer] = useState([]);
    const [questionAndAnswerUniqueId, setQuestionAndAnswerUniqueId] = useState("");

    const fetchQuestionAndAnswer = async () => {
        try {
            const response = await API.get(`/questionAndAnswer`);
            const filteredQuestionAndAnswer = response.data.filter((questionAndAnswer) => questionAndAnswer.propertyId === Number(uniqueId));
            setQuestionAndAnswer(filteredQuestionAndAnswer);
        } catch (error) {
            console.error('Error fetching questionAndAnswer:', error);
        }
    };

    useEffect(() => {
        fetchQuestionAndAnswer();
    }, [uniqueId]);

    const handleHideQuestionAndAnswerPage = () => {
        setToggleQuestionAndAnswerPage(false);
    }

    const handleShowQuestionAndAnswerPage = () => {
        setToggleQuestionAndAnswerPage(true);
    }

    const handleEditQuestionAndAnswer = (id) => {
        setToggleQuestionAndAnswerPage(false);
        setQuestionAndAnswerUniqueId(id);
    };

    const handleDeleteQuestionAndAnswer = (id) => {
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
                    fetchQuestionAndAnswer();
                } catch (error) {
                    toast.error("Error deleting questionAndAnswer");
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
                            {questionAndAnswer.length > 0
                                ?
                                toggleQuestionAndAnswerPage
                                    ?
                                    <strong>QnA</strong>
                                    :
                                    <strong>Edit QnA</strong>
                                :
                                <strong>QnA</strong>
                            }
                        </h5>
                    </div>
                    {questionAndAnswer.length > 0
                        ?
                        toggleQuestionAndAnswerPage ?
                            null
                            :
                            <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowQuestionAndAnswerPage}>
                                <i className="fe fe-x"></i>
                            </button>
                        :
                        null
                    }
                </Card.Header>
                <Card.Body>
                    {toggleQuestionAndAnswerPage
                        ?
                        <>
                            {questionAndAnswer.length > 0 ? (
                                <Accordion id="accordionExample">
                                    {questionAndAnswer.map((item, index) => (
                                            <div className="mt-1" key={index}>
                                                <Accordion.Item eventKey={item.uniqueId}>
                                                    <div className="d-flex justify-content-between align-items-center px-2 py-1">
                                                        <Accordion.Header className="flex-grow-1">{item.question}</Accordion.Header>
                                                        <span className='ms-1'>
                                                            <button className="btn btn-primary btn-sm me-1" title="Edit" onClick={() => handleEditQuestionAndAnswer(item.uniqueId)}>
                                                                <i className="fe fe-edit"></i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" title="Close" onClick={() => handleDeleteQuestionAndAnswer(item.uniqueId)}>
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
                            )}
                        </>
                        :
                        <>
                            <EditQuestionAndAnswer questionAndAnswerUniqueId={questionAndAnswerUniqueId} />
                        </>
                    }
                </Card.Body>
            </Card>

            {toggleQuestionAndAnswerPage
                ?
                <>
                    <Card>
                        <Card.Header>
                            <div className="media-heading">
                                <h5>
                                    <strong>Add QnA</strong>
                                </h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <AddQuestionAndAnswer />
                        </Card.Body>
                    </Card>
                </>
                :
                null
            }
        </Fragment>
    );
}

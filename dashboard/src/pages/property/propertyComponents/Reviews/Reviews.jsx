import React, { Fragment, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddReviews from './AddReviews';
import EditReviews from './EditReviews';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import ALLImages from '../../../../common/Imagesdata';

export default function Reviews() {
    const [toggleReviewsPage, setToggleReviewsPage] = useState(true);
    const { uniqueId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [reviewsUniqueId, setReviewsUniqueId] = useState("");

    const fetchReviews = async () => {
        try {
            const response = await API.get(`/reviews`);
            const filteredReviews = response.data.filter((reviews) => reviews.propertyId === Number(uniqueId));
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [uniqueId]);

    const handleShowReviewsPage = () => {
        setToggleReviewsPage(true);
    }

    const handleEditReviews = (id) => {
        setToggleReviewsPage(false);
        setReviewsUniqueId(id);
    };

    const handleDeleteReviews = (id) => {
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
                    const response = await API.delete(`/reviews/${id}`);
                    toast.success(response.data.message);
                    fetchReviews();
                } catch (error) {
                    toast.error("Error deleting reviews");
                }
            }
        });
    };

    const totalRatings = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            {reviews.length > 0
                                ?
                                toggleReviewsPage
                                    ?
                                    <strong>Reviews</strong>
                                    :
                                    <strong>Edit Reviews</strong>
                                :
                                <strong>Reviews</strong>
                            }
                        </h5>
                    </div>
                    <div>
                        {reviews.length > 0
                            ?
                            toggleReviewsPage ?
                                null
                                :
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowReviewsPage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            :
                            null
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    {toggleReviewsPage
                        ?
                        <>
                            {reviews.length > 0 ? (
                                <>
                                    <p><StarIcon style={{ color: "#faaf00" }} fontSize="inherit" /> {`${averageRating}/5`} ({reviews?.length} Reviews)</p>
                                    {reviews.map((items) => (
                                        <div className="media mb-3 position-relative" key={items.uniqueId}>
                                            <div className=" me-3">
                                                {items.gender === "Male" ? (
                                                    <img className="media-object rounded-circle thumb-sm" alt="64x64" src={ALLImages('male_avatar_icon')} />
                                                ) : (
                                                    <img className="media-object rounded-circle thumb-sm" alt="64x64" src={ALLImages('female_avatar_icon')} />
                                                )}
                                            </div>
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-0">{items.name}</h5>
                                                <Rating
                                                    style={{ fontSize: "17px" }}
                                                    name="simple-controlled"
                                                    value={items.rating}
                                                    disabled
                                                    emptyIcon={<StarIcon fontSize="inherit" />}
                                                />
                                                <p className="font-13 text-muted mb-0">{items.review}</p>
                                            </div>
                                            <span className='position-absolute top-0 end-0'>
                                                <button className='btn btn-primary btn-sm me-1' onClick={() => handleEditReviews(items.uniqueId)}>
                                                    <i className="fe fe-edit"></i>
                                                </button>
                                                <button className='btn btn-danger btn-sm' onClick={() => handleDeleteReviews(items.uniqueId)}>
                                                    <i className="fe fe-trash"></i>
                                                </button>
                                            </span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>No Reviews Found</p>
                            )}

                        </>
                        :
                        <>
                            <EditReviews reviewsUniqueId={reviewsUniqueId} />
                        </>
                    }
                </Card.Body>
            </Card>

            {toggleReviewsPage
                ?
                <>
                    <Card>
                        <Card.Header>
                            <div className="media-heading">
                                <h5>
                                    <strong>Add Reviews</strong>
                                </h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <AddReviews />
                        </Card.Body>
                    </Card>
                </>
                :
                null
            }
        </Fragment>
    );
}

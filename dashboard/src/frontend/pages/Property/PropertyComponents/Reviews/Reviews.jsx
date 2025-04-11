// import React, { Fragment, useEffect, useState } from "react";
// import { Card } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import { API } from "../../../../../services/API";
// import ALLImages from "../../../../../common/Imagesdata";
// import { Rating } from "@mui/material";
// import StarIcon from '@mui/icons-material/Star';

// export default function Reviews() {
//     const { collegeId } = useParams();
//     const [propertyReviews, setPropertyReviews] = useState([]);

//     useEffect(() => {
//         const fetchPropertyReviewsData = async () => {
//             const response = await API.get("/reviews");
//             const filteredReviewsProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
//             setPropertyReviews(filteredReviewsProperty);
//         };

//         fetchPropertyReviewsData();
//     }, []);

//     return (
//         <Fragment>
//             <Card>
//                 <Card.Header>
//                     <h2>Uttaranchal University Reviews</h2>
//                 </Card.Header>
//                 <Card.Body>
//                     {propertyReviews.map((reviews, index) => (
//                         <>
//                             <div key={index} className="flex items-start space-x-3 p-4 border-b">
//                                 <img
//                                     className="media-object rounded-full w-16 h-16 aspect-square"
//                                     alt="Profile"
//                                     src={
//                                         reviews.gender === "Male"
//                                             ? ALLImages("male_avatar_icon")
//                                             : ALLImages("female_avatar_icon")
//                                     }
//                                 />
//                                 <div>
//                                     <h3 className="text-lg font-semibold">{reviews.name}</h3>
//                                     <Rating
//                                         style={{ fontSize: "18px" }}
//                                         name="simple-controlled"
//                                         value={reviews.rating}
//                                         disabled
//                                         emptyIcon={<StarIcon fontSize="inherit" />}
//                                     />
//                                     <p className="text-gray-600 text-sm">{reviews.review}</p>
//                                 </div>
//                             </div>
//                         </>
//                     ))}
//                 </Card.Body>
//             </Card>
//         </Fragment>
//     )
// };
import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import ALLImages from "../../../../../common/Imagesdata";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Skeleton from "react-loading-skeleton";

export default function Reviews() {
    const { collegeId } = useParams();
    const [propertyReviews, setPropertyReviews] = useState([]);
    const [expandedReviews, setExpandedReviews] = useState({});
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyReviewsData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/reviews");
                const filteredReviewsProperty = response?.data?.filter(
                    (property) => property?.propertyId === Number(collegeId)
                );
                setPropertyReviews(filteredReviewsProperty);
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false);
            }
        };

        const fetchPropertyData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/get-property-list");
                const filteredProperty = response?.data?.filter((property) => property?.uniqueId === Number(collegeId));
                setProperty(filteredProperty);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyReviewsData();
        fetchPropertyData();
    }, []);

    const toggleReadMore = (index) => {
        setExpandedReviews((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <>
                    <Card>
                        <Card.Header>
                            <h2>{property[0]?.property_name} Reviews</h2>
                        </Card.Header>
                        <Card.Body>
                            {propertyReviews.map((review, index) => (
                                <div key={index} className="flex items-start space-x-3 p-4 border-b">
                                    <img
                                        className="media-object rounded-full w-16 h-16 aspect-square"
                                        alt="Profile"
                                        src={
                                            review.gender === "Male"
                                                ? ALLImages("male_avatar_icon")
                                                : ALLImages("female_avatar_icon")
                                        }
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{review.name}</h3>
                                        <Rating
                                            style={{ fontSize: "18px" }}
                                            name="simple-controlled"
                                            value={review.rating}
                                            disabled
                                            emptyIcon={<StarIcon fontSize="inherit" />}
                                        />
                                        <p className={`text-gray-600 text-sm ${expandedReviews[index] ? "" : "line-clamp-3"}`}>
                                            {review.review}
                                        </p>
                                        {review.review.length > 100 && (
                                            <button
                                                className="text-blue-500 text-sm mt-1 focus:outline-none"
                                                onClick={() => toggleReadMore(index)}
                                            >
                                                {expandedReviews[index] ? "Read Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                    <style>
                        {`
                            .line-clamp-3 {
                                display: -webkit-box;
                                -webkit-line-clamp: 3;
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                            }
                        `}
                    </style>
                </>
            )}
        </Fragment>
    );
}

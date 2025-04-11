import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function QnA() {
    const { collegeId } = useParams();
    const [propertyQnA, setPropertyQnA] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyQnAData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/questionandanswer");
                const filteredQnAProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyQnA(filteredQnAProperty);
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

        fetchPropertyQnAData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>Questions and Answers On {property[0]?.property_name}</h2>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            {propertyQnA.map((qna, index) => (
                                <div key={index}>
                                    <h5>{qna.question}</h5>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: qna.answer
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Fragment>
    )
}

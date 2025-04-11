import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Skeleton from "react-loading-skeleton";

export default function Faqs() {
    const { collegeId } = useParams();
    const [propertyFaqs, setPropertyFaqs] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyFaqsData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/faqs");
                const filteredFaqsProperty = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyFaqs(filteredFaqsProperty);
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

        fetchPropertyFaqsData();
        fetchPropertyData();
    }, []);

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>Frequently Asked Questions On {property[0]?.property_name}</h2>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            {propertyFaqs.map((faq, index) => (
                                <div key={index}>
                                    <h5>{faq.question}</h5>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: faq.answer
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
};

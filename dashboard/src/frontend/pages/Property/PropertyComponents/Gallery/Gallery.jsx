import React, { Fragment, useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { API } from "../../../../../services/API";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default function Gallery() {
    const { collegeId } = useParams();
    const [propertyGallery, setPropertyGallery] = useState([]);
    const [open, setOpen] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [property, setProperty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPropertyGalleryData = async () => {
            try {
                setLoading(true);
                const response = await API.get("/gallery");
                const filteredPropertyGallery = response?.data?.filter((property) => property?.propertyId === Number(collegeId));
                setPropertyGallery(filteredPropertyGallery);
            } catch (error) {
                console.log(error.message);
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

        fetchPropertyGalleryData();
        fetchPropertyData();
    }, []);

    const openLightbox = (images) => {
        setLightboxImages(images.map(img => ({ src: `${import.meta.env.VITE_API_URL}${img}` })));
        setOpen(true);
    };

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={250} className="mb-3" />
            ) : (
                <Card>
                    <Card.Header>
                        <h2>{property[0]?.property_name} Gallery</h2>
                    </Card.Header>
                    <Card.Body>
                        {propertyGallery.map((item) => (
                            <Card key={item.uniqueId}>
                                <Card.Header className="flex justify-between">
                                    <div className="media-heading">
                                        <h5>{item.title}</h5>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="img-gallery">
                                        {item.gallery.map((image, index) => (
                                            <Col key={index} lg={3} md={4} sm={6} xs={12}>
                                                <Link
                                                    to="#"
                                                    onClick={() => openLightbox(item.gallery)}
                                                    className="glightbox card w-32"
                                                >
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}${image}`}
                                                        alt={`image-${index + 1}`}
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
            )}

            {open && (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                    zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                    slides={lightboxImages}
                />
            )}
        </Fragment>
    )
}

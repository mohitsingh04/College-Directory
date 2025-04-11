import React, { useEffect, Fragment, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import AddGallery from "./AddGallery";
import EditGallery from "./EditGallery";
import { API } from "../../../../services/API";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Gallery() {
    const [open, setOpen] = useState(false);
    const [toggleGalleryPage, setToggleGalleryPage] = useState(true);
    const { uniqueId } = useParams();
    const [gallery, setGallery] = useState([]);
    const [galleryUniqueId, setGalleryUniqueId] = useState("");
    const [lightboxImages, setLightboxImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/gallery`);
            const filteredGallery = response.data.filter(
                (gallery) => String(gallery.propertyId) === String(uniqueId)
            );
            setGallery(filteredGallery);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [uniqueId]);

    const handleEditGallery = (id) => {
        setToggleGalleryPage(false);
        setGalleryUniqueId(id);
    };

    const handleDeleteGallery = (id) => {
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
                    const response = await API.delete(`/gallery/${id}`);
                    toast.success(response.data.message);
                    fetchGallery();
                } catch (error) {
                    toast.error("Error deleting gallery");
                }
            }
        });
    };

    const openLightbox = (images) => {
        setLightboxImages(images.map(img => ({ src: `${import.meta.env.VITE_API_URL}${img}` })));
        setOpen(true);
    };

    return (
        <Fragment>
            {toggleGalleryPage ? (
                <>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {gallery.length > 0 ? (
                                <>
                                    {gallery.map((item) => (
                                        <Card key={item.uniqueId}>
                                            <Card.Header className="flex justify-between">
                                                <div className="media-heading">
                                                    <h5>{item.title}</h5>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-primary btn-sm me-1"
                                                        title="Edit"
                                                        onClick={() => handleEditGallery(item.uniqueId)}
                                                    >
                                                        <i className="fe fe-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        title="Delete"
                                                        onClick={() => handleDeleteGallery(item.uniqueId)}
                                                    >
                                                        <i className="fe fe-trash"></i>
                                                    </button>
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
                                </>
                            ) : (
                                <Card>
                                    <Card.Body>
                                        <p>No Gallery Found.</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </>
                    )}
                </>
            ) : (
                <Card>
                    <Card.Header className="flex justify-between">
                        <h5>{gallery.length > 0 ? <strong>Edit Gallery</strong> : <strong>Gallery</strong>}</h5>
                        {gallery.length > 0 && !toggleGalleryPage && (
                            <button
                                className="btn btn-danger btn-sm"
                                title="Close"
                                onClick={() => setToggleGalleryPage(true)}
                            >
                                <i className="fe fe-x"></i>
                            </button>
                        )}
                    </Card.Header>
                    <Card.Body>
                        <EditGallery galleryUniqueId={galleryUniqueId} />
                    </Card.Body>
                </Card>
            )}

            {toggleGalleryPage && (
                <Card>
                    <Card.Header>
                        <h5>
                            <strong>Add Gallery</strong>
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <AddGallery />
                    </Card.Body>
                </Card>
            )}

            {/* Lightbox Component */}
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
    );
};

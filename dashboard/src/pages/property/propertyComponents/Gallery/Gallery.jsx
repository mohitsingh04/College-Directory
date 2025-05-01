import React, { useEffect, Fragment, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import AddGallery from "./AddGallery";
import EditGallery from "./EditGallery";
import { API } from "../../../../services/API";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";

export default function Gallery() {
    const { uniqueId } = useParams();

    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("list"); // list | add | edit
    const [galleryUniqueId, setGalleryUniqueId] = useState(null);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [lightboxImages, setLightboxImages] = useState([]);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/gallery`);
            const filtered = response.data.filter(
                (item) => String(item.propertyId) === String(uniqueId)
            );
            setGallery(filtered);
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
        setGalleryUniqueId(id);
        setViewMode("edit");
    };

    const handleDeleteGallery = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
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

    const openLightboxHandler = (images) => {
        setLightboxImages(images.map(img => ({ src: `${import.meta.env.VITE_API_URL}${img}` })));
        setOpenLightbox(true);
    };

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={500} />
            ) : (
                <>
                    {/* Gallery List */}
                    {viewMode === "list" && (
                        <>
                            <div className="flex justify-end mb-3">
                                <button
                                    className="btn btn-success"
                                    onClick={() => setViewMode("add")}
                                >
                                    <i className="fe fe-plus me-1"></i> Add Gallery
                                </button>
                            </div>

                            {gallery.length === 0 ? (
                                <Card>
                                    <Card.Body>
                                        <p>No gallery found.</p>
                                    </Card.Body>
                                </Card>
                            ) : (
                                gallery.map((item) => (
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
                                                            onClick={() => openLightboxHandler(item.gallery)}
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
                                ))
                            )}
                        </>
                    )}

                    {/* Add Gallery Form */}
                    {viewMode === "add" && (
                        <Card>
                            <Card.Header className="flex justify-between">
                                <h5><strong>Add Gallery</strong></h5>
                                <button
                                    className="btn btn-danger btn-sm"
                                    title="Close"
                                    onClick={() => setViewMode("list")}
                                >
                                    <i className="fe fe-x"></i>
                                </button>
                            </Card.Header>
                            <Card.Body>
                                <AddGallery
                                    onSuccess={() => {
                                        fetchGallery();
                                        setViewMode("list");
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    )}

                    {/* Edit Gallery Form */}
                    {viewMode === "edit" && (
                        <Card>
                            <Card.Header className="flex justify-between">
                                <h5><strong>Edit Gallery</strong></h5>
                                <button
                                    className="btn btn-danger btn-sm"
                                    title="Close"
                                    onClick={() => setViewMode("list")}
                                >
                                    <i className="fe fe-x"></i>
                                </button>
                            </Card.Header>
                            <Card.Body>
                                <EditGallery
                                    galleryUniqueId={galleryUniqueId}
                                    onSuccess={() => {
                                        fetchGallery();
                                        setViewMode("list");
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    )}

                    {/* Lightbox */}
                    {openLightbox && (
                        <Lightbox
                            open={openLightbox}
                            close={() => setOpenLightbox(false)}
                            plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                            zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                            slides={lightboxImages}
                        />
                    )}
                </>
            )}
        </Fragment>
    );
}

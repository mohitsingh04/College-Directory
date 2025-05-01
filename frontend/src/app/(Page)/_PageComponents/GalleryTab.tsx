"use client";

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface PropertyGallery {
	title: string;
	gallery: [];
}

export default function GalleryTab() {
	const { id } = useParams();
	const [propertyGallery, setPropertyGallery] = useState<PropertyGallery[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [lightboxImages, setLightboxImages] = useState([]);

	const fetchPropertyGallery = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/gallery");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyGallery(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyGallery();
	}, [fetchPropertyGallery]);

	const openLightbox = (images: any) => {
		setLightboxImages(
			images.map((img: any) => ({
				src: `${process.env.NEXT_PUBLIC_API_URL}/${img}`,
			}))
		);
		setOpen(true);
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<div className="px-4 py-10 sm:px-6 lg:px-8">
					<div className="max-w-7xl mx-auto space-y-12">
						<div className="space-y-10">
							{propertyGallery.map((item, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl p-6 transition"
								>
									<div className="flex items-center justify-between mb-6 border-b pb-3">
										<h3 className="text-2xl font-semibold text-gray-700">
											{item.title}
										</h3>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
										{item.gallery.map((image, imgIndex) => (
											<div
												key={imgIndex}
												className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition duration-300"
											>
												<Link
													href="#"
													onClick={() => openLightbox(item.gallery)}
												>
													<img
														src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
														alt={`image-${imgIndex + 1}`}
														className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
													/>
												</Link>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{open && (
				<Lightbox
					open={open}
					close={() => setOpen(false)}
					plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
					zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
					slides={lightboxImages}
					thumbnails={{ position: "bottom" }}
					styles={{ container: { zIndex: 1050 } }}
				/>
			)}
		</>
	);
}

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyGallery {
	title: string;
	gallery: [];
}

export default function GalleryTab() {
	const { id } = useParams();
	const [propertyGallery, setPropertyGallery] = useState<PropertyGallery[]>([]);
	const [loading, setLoading] = useState(true);

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

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2">Gallery</h3>

							{/* {propertyGallery.map((gallery, index) => (
								<>
									<h4 key={index}>{gallery?.title}</h4>
									{gallery?.gallery.map((item) => (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											<div>
												<img
													className="h-auto max-w-full rounded-lg"
													src={`${process.env.NEXT_PUBLIC_API_URL}/${item}`}
													alt=""
												/>
											</div>
										</div>
									))}
								</>
							))} */}
							{propertyGallery.map((gallery, index) => (
								<div key={index} className="mb-10">
									<h4 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
										{gallery?.title}
									</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{gallery?.gallery.map((item, idx) => (
											<div
												key={idx}
												className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
											>
												<img
													className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
													src={`${process.env.NEXT_PUBLIC_API_URL}/${item}`}
													alt={`Gallery Image ${idx + 1}`}
												/>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</>
	);
}

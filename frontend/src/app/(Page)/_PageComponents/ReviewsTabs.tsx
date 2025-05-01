import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";

interface PropertyReview {
	id: number;
	propertyId: number;
	name: string;
	gender: string;
	rating: number;
	review: string;
}

export function ReviewsTab() {
	const params = useParams();
	const id = params?.id; // safer way
	const [propertyReviews, setPropertyReviews] = useState<PropertyReview[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedReviews, setExpandedReviews] = useState<
		Record<number, boolean>
	>({});

	const fetchPropertyReviews = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/reviews");
			const filteredReviews = response?.data?.filter(
				(review: any) => review?.propertyId === Number(id)
			);
			setPropertyReviews(filteredReviews || []);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (id) {
			fetchPropertyReviews();
		}
	}, [fetchPropertyReviews, id]);

	const toggleReadMore = (index: number) => {
		setExpandedReviews((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<div className="space-y-6">
					{propertyReviews.map((review, index) => (
						<div
							key={index}
							className="flex items-start space-x-3 p-4 border-b"
						>
							<img
								className="media-object rounded-full w-16 h-16 aspect-square"
								alt="Profile"
								src={
									review.gender === "Male"
										? "https://img.icons8.com/ios-glyphs/80/user-male-circle.png"
										: "https://img.icons8.com/ios-glyphs/80/user-female-circle.png"
								}
							/>
							<div>
								<h3 className="text-lg font-semibold">{review.name}</h3>
								<div className="flex items-center space-x-1 my-1">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											size={16}
											className={
												i < review.rating
													? "text-yellow-400 fill-current"
													: "text-gray-300"
											}
										/>
									))}
								</div>
								<p
									className={`text-gray-600 text-sm ${
										expandedReviews[index] ? "" : "line-clamp-3"
									}`}
								>
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
				</div>
			)}
		</>
	);
}

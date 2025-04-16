import React from "react";
import { Star } from "lucide-react";

export function ReviewsTab() {
	const reviews = [
		{
			name: "Rahul Singh",
			rating: 4,
			course: "B.Tech CSE",
			comment:
				"Great infrastructure and faculty. The placement cell is very active.",
			date: "2 months ago",
		},
		{
			name: "Priya Sharma",
			rating: 5,
			course: "MBA",
			comment: "Excellent learning environment with good industry exposure.",
			date: "3 months ago",
		},
	];

	return (
		<div className="space-y-6">
			{reviews.map((review, index) => (
				<div key={index} className="border-b border-gray-200 pb-6">
					<div className="flex items-center justify-between mb-2">
						<div>
							<h3 className="font-semibold text-gray-900">{review.name}</h3>
							<p className="text-sm text-gray-600">{review.course}</p>
						</div>
						<span className="text-sm text-gray-500">{review.date}</span>
					</div>
					<div className="flex items-center mb-2">
						{[...Array(5)].map((_, i) => (
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
					<p className="text-gray-600">{review.comment}</p>
				</div>
			))}
		</div>
	);
}

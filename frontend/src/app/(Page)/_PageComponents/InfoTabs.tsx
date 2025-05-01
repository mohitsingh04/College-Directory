"use client";

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { School, Award, BookOpen, Users, MapPin, Calendar } from "lucide-react";

interface PropertyDetails {
	short_description: string;
	full_description: string;
}

export function InfoTab() {
	const { id } = useParams();
	const [propertyDetails, setPropertyDetails] = useState<PropertyDetails[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyDetails = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/otherBasicDetails");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyDetails(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyDetails();
	}, [fetchPropertyDetails]);

	const highlights = [
		{
			icon: School,
			title: "Modern Campus",
			description: "State-of-the-art facilities spread across 100 acres",
		},
		{
			icon: Award,
			title: "Academic Excellence",
			description: "Consistently ranked among top universities",
		},
		{
			icon: BookOpen,
			title: "Library",
			description: "Digital library with over 50,000 resources",
		},
		{
			icon: Users,
			title: "Student Life",
			description: "Active campus community with 30+ clubs",
		},
		{
			icon: MapPin,
			title: "Location",
			description: "Prime location with excellent connectivity",
		},
		{
			icon: Calendar,
			title: "Events",
			description: "Regular industry workshops and seminars",
		},
	];

	if (loading) {
		return (
			<div className="min-h-[400px] flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-fadeIn">
			{/* About Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2 border-b pb-2">
					<School className="text-indigo-600" size={24} />
					<h2 className="text-2xl font-bold text-gray-900">About University</h2>
				</div>
				<div className="prose prose-indigo max-w-none">
					<div
						className="text-gray-600 leading-relaxed"
						dangerouslySetInnerHTML={{
							__html: propertyDetails?.[0]?.short_description || "",
						}}
					/>
				</div>
			</section>

			{/* Highlights Grid */}
			<section className="space-y-4">
				<div className="flex items-center gap-2 border-b pb-2">
					<Award className="text-indigo-600" size={24} />
					<h2 className="text-2xl font-bold text-gray-900">
						Campus Highlights
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{highlights.map((highlight, index) => (
						<div
							key={index}
							className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-start gap-4">
								<div className="p-3 bg-indigo-50 rounded-lg">
									<highlight.icon className="text-indigo-600" size={24} />
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										{highlight.title}
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{highlight.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Full Description */}
			<section className="space-y-4">
				<div className="flex items-center gap-2 border-b pb-2">
					<BookOpen className="text-indigo-600" size={24} />
					<h2 className="text-2xl font-bold text-gray-900">
						Detailed Overview
					</h2>
				</div>
				<div className="prose prose-indigo max-w-none">
					<div
						className="text-gray-600 leading-relaxed"
						dangerouslySetInnerHTML={{
							__html: propertyDetails?.[0]?.full_description || "",
						}}
					/>
				</div>
			</section>
		</div>
	);
}

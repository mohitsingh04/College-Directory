"use client";

import { FaStar } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Download, MapPin, ChevronRight, Navigation2 } from "lucide-react";
import API from "@/services/API/API";
import { InfoTab } from "@/app/(Page)/_PageComponents/InfoTabs";
import { CoursesTab } from "@/app/(Page)/_PageComponents/CoursesTabs";
import { ReviewsTab } from "@/app/(Page)/_PageComponents/ReviewsTabs";
import { DepartmentTab } from "@/app/(Page)/_PageComponents/DepartmentTabs";
import Loader from "@/Components/Loader/Loader";
import Skeleton from "react-loading-skeleton";
import GalleryTab from "@/app/(Page)/_PageComponents/GalleryTab";
import HostelTab from "@/app/(Page)/_PageComponents/HostelTab";
import AdmissionTab from "@/app/(Page)/_PageComponents/AdmissionTab";
import FaqsTab from "@/app/(Page)/_PageComponents/FaqsTab";
import ScholarshipTab from "@/app/(Page)/_PageComponents/ScholarshipTab";
import AnncouncementTab from "@/app/(Page)/_PageComponents/AnnouncementTab";
import FacultyTab from "@/app/(Page)/_PageComponents/FacultyTab";
import QnATab from "@/app/(Page)/_PageComponents/QnaTabs";

interface Property {
	property_name: string;
	short_name: string;
	property_type: string;
	uniqueId: number;
	featured_image: string;
	college_or_university_type: { value: string }[];
	affiliated_by: any;
	propertyCourse: any[];
	logo: string;
}

interface Location {
	city: string;
	state: string;
}

interface Review {
	rating: number;
}

export default function University() {
	const { id } = useParams();
	const [property, setProperty] = useState<Property | null>(null);
	const [location, setLocation] = useState<Location[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [activeTab, setActiveTab] = useState("info");
	const [loading, setLoading] = useState(true);

	const fetchProperty = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get(`/property/${id}`);
			setProperty(response.data);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	const fetchLocation = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get(`/location`);
			const filteredLocation = response.data.filter(
				(location: any) => location.propertyId === Number(id)
			);
			setLocation(filteredLocation);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	const fetchReviews = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get(`/reviews`);
			const filteredReviews = response.data.filter(
				(reviews: any) => reviews.propertyId === Number(id)
			);
			setReviews(filteredReviews);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchProperty();
		fetchLocation();
		fetchReviews();
	}, [fetchProperty, fetchLocation, fetchReviews]);

	const totalRatings = reviews.reduce((sum, item) => sum + item.rating, 0);
	const averageRating =
		reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

	const tabs = [
		{ id: "info", label: "Info" },
		{ id: "courses", label: "Courses & Fees" },
		{ id: "gallery", label: "Gallery" },
		{ id: "hostel", label: "Hostel" },
		{ id: "admission", label: "Admission" },
		{ id: "faqs", label: "Faq's" },
		{ id: "scholarship", label: "Scholarship" },
		{ id: "announcement", label: "Announcement" },
		{ id: "faculty", label: "Faculty" },
		{ id: "reviews", label: "Reviews" },
		{ id: "qna", label: "QnA" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "info":
				return <InfoTab />;
			case "courses":
				return <CoursesTab />;
			case "gallery":
				return <GalleryTab />;
			case "hostel":
				return <HostelTab />;
			case "admission":
				return <AdmissionTab />;
			case "faqs":
				return <FaqsTab />;
			case "scholarship":
				return <ScholarshipTab />;
			case "announcement":
				return <AnncouncementTab />;
			case "faculty":
				return <FacultyTab />;
			case "reviews":
				return <ReviewsTab />;
			case "qna":
				return <QnATab />;
			default:
				return (
					<div className="text-gray-600">
						Content for {tabs.find((tab) => tab.id === activeTab)?.label} tab is
						coming soon.
					</div>
				);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen mt-5 md:px-14">
			{/* Breadcrumb */}
			<div className="bg-white px-4 py-2 text-sm text-gray-600">
				<div className="max-w-7xl mx-auto flex items-center gap-2">
					<a href="#" className="text-indigo-600 hover:underline">
						Home
					</a>
					<ChevronRight size={16} />
					<a href="#" className="text-indigo-600 hover:underline">
						{location?.[0]?.city}
					</a>
					<ChevronRight size={16} />
					<span>{property?.property_name}</span>
				</div>
			</div>

			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-start gap-6">
						{/* Logo */}
						<div className="w-24 h-24 rounded-lg flex items-center justify-center">
							<img
								src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=96&h=96"
								alt="University Logo"
								className="w-20 h-20 object-contain"
							/>
						</div>

						{/* Info */}
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900">
								{property?.property_name}, {location?.[0]?.city} - Course & Fees
								Details
							</h1>

							<div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
								<div className="flex items-center gap-1">
									<MapPin size={16} />
									<span>
										{location?.[0]?.city}, {location?.[0]?.state}
									</span>
								</div>
								<span className="text-gray-300">|</span>
								<span>
									{property ? (
										<span>
											{property?.college_or_university_type[0]?.value}{" "}
											{property?.property_type}
										</span>
									) : null}
								</span>
								<span className="text-gray-300">|</span>
								<span>
									{Array.isArray(property?.affiliated_by)
										? property.affiliated_by
												.map((item) => item.value)
												.join(", ")
										: "N/A"}{" "}
									{"Approved"}
								</span>
								<span className="text-gray-300">|</span>
								<span>NAAC Grade A+</span>
							</div>

							<div className="mt-4 flex items-center gap-6">
								<div className="flex items-center gap-2">
									<span className="text-yellow-400">★</span>
									{/* <span className="font-semibold">8/10</span>
									<span className="text-sm text-gray-600">| (85 Reviews)</span> */}
									<span className="text-sm text-gray-600 hover:underline">
										{averageRating !== 0
											? `${averageRating}/5 |`
											: "No reviews yet"}{" "}
										({reviews?.length} Reviews){" "}
									</span>
								</div>
								|
								<button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 cursor-pointer hover:underline">
									<Navigation2 size={16} />
									<span>Apply Now</span>
								</button>
								|
								<button className="flex items-center gap-1 px-3 py-1 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white cursor-pointer">
									<Download size={16} />
									<span>Download Brochure</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center gap-8 overflow-x-auto pb-px">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								className={`py-4 px-1 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
									activeTab === tab.id
										? "border-indigo-600 text-indigo-600"
										: "border-transparent text-gray-600 hover:text-gray-900"
								}`}
								onClick={() => setActiveTab(tab.id)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-white rounded-lg shadow p-6">
					{renderTabContent()}
				</div>
			</div>
		</div>
	);
}

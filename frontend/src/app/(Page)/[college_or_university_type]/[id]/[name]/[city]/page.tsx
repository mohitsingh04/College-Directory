"use client";

import { useCallback, useEffect, useState } from "react";
import {
	useParams,
	useRouter,
	usePathname,
	useSearchParams,
} from "next/navigation";
import { FaStar } from "react-icons/fa";
import { Download, MapPin, ChevronRight, Navigation2 } from "lucide-react";
import API from "@/services/API/API";
import { InfoTab } from "@/app/(Page)/_PageComponents/InfoTabs";
import { CoursesTab } from "@/app/(Page)/_PageComponents/CoursesTabs";
import { ReviewsTab } from "@/app/(Page)/_PageComponents/ReviewsTabs";
import Loader from "@/Components/Loader/Loader";
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [property, setProperty] = useState<Property | null>(null);
	const [location, setLocation] = useState<Location[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("");

	const activeTab = searchParams.get("tab") || "info";

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

	const capitalizeFirstWord = (str: any) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const handleTabClick = (tabId: string) => {
		setTab(capitalizeFirstWord(tabId));
		router.push(`${pathname}?tab=${tabId}`);
	};

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
					<div className="text-gray-500">
						Content for {tabs.find((tab) => tab.id === activeTab)?.label} is
						coming soon.
					</div>
				);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen py-8 px-4 md:px-12 bg-gray-100">
			{/* Breadcrumb */}
			<nav className="text-sm mb-6">
				<div className="flex items-center gap-2 text-gray-600">
					<a href="#" className="hover:underline hover:text-indigo-600">
						Home
					</a>
					<ChevronRight size={16} />
					<a href="#" className="hover:underline hover:text-indigo-600">
						{location?.[0]?.city}
					</a>
					{tab ? (
						<>
							<ChevronRight size={16} />
							<span className="text-gray-800">{property?.property_name}</span>
							<ChevronRight size={16} />
							<span className="text-gray-800">{tab}</span>
						</>
					) : (
						<>
							<ChevronRight size={16} />
							<span className="text-gray-800">{property?.property_name}</span>
						</>
					)}
				</div>
			</nav>

			{/* Header */}
			<section className="bg-white shadow-md rounded-xl p-6 mb-8">
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="w-24 h-24 flex-shrink-0">
						<img
							src={`${process.env.NEXT_PUBLIC_API_URL}/${property?.logo}`}
							alt="University Logo"
							className="w-full h-full object-contain rounded-lg"
						/>
					</div>
					<div className="flex-1">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
							{tab ? (
								<>
									{property?.property_name}, {location?.[0]?.city} - {tab}
								</>
							) : (
								<>
									{property?.property_name}, {location?.[0]?.city}
								</>
							)}
						</h1>
						<div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-4">
							<div className="flex items-center gap-1">
								<MapPin size={16} />
								<span>
									{location?.[0]?.city}, {location?.[0]?.state}
								</span>
							</div>
							<span className="hidden md:inline-block">|</span>
							<div>
								{property?.college_or_university_type?.[0]?.value}{" "}
								{property?.property_type}
							</div>
							<span className="hidden md:inline-block">|</span>
							<div>
								{Array.isArray(property?.affiliated_by)
									? property.affiliated_by.map((item) => item.value).join(", ")
									: "N/A"}{" "}
								Approved
							</div>
							<span className="hidden md:inline-block">|</span>
							<div>NAAC Grade A+</div>
						</div>
						<div className="flex flex-wrap items-center gap-6 text-sm">
							<div className="flex items-center gap-1 text-yellow-500">
								<FaStar size={16} />
								<span className="text-gray-800">
									{averageRating !== 0 ? `${averageRating}/5` : "No Reviews"} (
									{reviews.length} Reviews)
								</span>
							</div>
							<button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-medium cursor-pointer">
								<Navigation2 size={18} />
								Apply Now
							</button>
							<button className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md transition font-medium cursor-pointer">
								<Download size={18} />
								Download Brochure
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Tabs */}
			<div className="bg-white rounded-lg shadow overflow-x-auto">
				<div className="flex min-w-max md:min-w-0">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							className={`flex-1 text-center whitespace-nowrap px-4 py-3 text-sm font-medium transition border-b-2 cursor-pointer ${
								activeTab === tab.id
									? "border-indigo-600 text-indigo-600"
									: "border-transparent text-gray-600 hover:text-gray-900"
							}`}
							onClick={() => handleTabClick(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="mt-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					{renderTabContent()}
				</div>
			</div>
		</div>
	);
}

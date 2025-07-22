"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, ChevronDown, Star, MapPin } from "lucide-react";
import API from "@/services/API/API";
import Loader from "@/Components/Loader/Loader";
import Link from "next/link";

// Interfaces
interface Review {
	rating: number;
}
interface Affiliation {
	value: string;
	label: string;
}
interface PropertyCourse {
	uniqueId: number;
	name: { value: string }[];
	short_name: string;
	course_type: { value: string }[];
}
interface Property {
	property_name: string;
	short_name: string;
	property_type: string;
	uniqueId: number;
	featured_image: string;
	reviews: Review[];
	college_or_university_type: { value: string }[];
	location: { city: string; state: string };
	affiliated_by: Affiliation[];
	propertyCourse: PropertyCourse[];
	brochure_url?: string;
}
interface PropertyLocation {
	uniqueId: number;
	city: string;
	state: string;
}
interface Filters {
	courses: string[];
	states: string[];
	cities: string[];
	courseTypes: string[];
	collegeTypes: string[];
}

// Component
export default function IndiaColleges() {
	const [mergedData, setMergedData] = useState<Property[]>([]);
	const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
	const [loading, setLoading] = useState(true);
	const [propertyCourse, setPropertyCourse] = useState<PropertyCourse[]>([]);
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(
		[]
	);
	const [searchPropertyCourse, setSearchPropertyCourse] = useState("");
	const [searchPropertyState, setSearchPropertyState] = useState("");
	const [searchPropertyCity, setSearchPropertyCity] = useState("");
	const [searchPropertyCollegeType, setSearchPropertyCollegeType] =
		useState("");
	const [filterPropertyCourseData, setFilterPropertyCourseData] = useState<
		PropertyCourse[]
	>([]);
	const [filterPropertyStateData, setFilterPropertyStateData] = useState<
		PropertyLocation[]
	>([]);
	const [filterPropertyCityData, setFilterPropertyCityData] = useState<
		PropertyLocation[]
	>([]);
	const [filterPropertyCollegeTypeData, setFilterPropertyCollegeTypeData] =
		useState<Property[]>([]);

	const [selectedFilters, setSelectedFilters] = useState<Filters>({
		courses: [],
		states: [],
		cities: [],
		courseTypes: [],
		collegeTypes: [],
	});

	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>({
		courses: true,
		states: true,
		cities: true,
		course_type: true,
		college_type: true,
	});

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const fetchAndMergeData = useCallback(async () => {
		try {
			setLoading(true);
			const [propertyRes, locationRes, reviewsRes, courseRes] =
				await Promise.all([
					API.get("/property"),
					API.get("/location"),
					API.get("/reviews"),
					API.get("/property-course"),
				]);

			const properties =
				propertyRes?.data?.filter((p: any) => p.status === "Active") || [];
			const locations = locationRes?.data || [];
			const reviews = reviewsRes?.data || [];
			const courses = courseRes?.data || [];

			setPropertyCourse(courses);
			setPropertyLocation(locations);

			const locationMap = new Map(
				locations.map((loc: any) => [loc.propertyId, loc])
			);
			const reviewsMap = new Map();
			reviews.forEach((rev: any) => {
				if (!reviewsMap.has(rev.propertyId)) reviewsMap.set(rev.propertyId, []);
				reviewsMap.get(rev.propertyId).push(rev);
			});

			const courseMap = new Map();
			courses.forEach((course: any) => {
				if (!courseMap.has(course.propertyId))
					courseMap.set(course.propertyId, []);
				courseMap.get(course.propertyId).push(course);
			});

			const merged = properties.map((property: any) => ({
				...property,
				location: locationMap.get(property.uniqueId) || {},
				reviews: reviewsMap.get(property.uniqueId) || [],
				propertyCourse: courseMap.get(property.uniqueId) || [],
			}));

			setMergedData(merged);
			setFilteredProperties(merged);
		} catch (err: any) {
			console.error(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAndMergeData();
	}, [fetchAndMergeData]);

	const handleFilterChange = (type: keyof Filters, value: string) => {
		setSelectedFilters((prev) => {
			const exists = prev[type].includes(value);
			const updated = exists
				? prev[type].filter((v) => v !== value)
				: [...prev[type], value];
			return { ...prev, [type]: updated };
		});
	};

	// Filtering logic
	useEffect(() => {
		let results = [...mergedData];

		if (selectedFilters.courses.length) {
			results = results.filter((property) =>
				property.propertyCourse.some((course) =>
					selectedFilters.courses.includes(course.name?.[0]?.value)
				)
			);
		}

		if (selectedFilters.courseTypes.length) {
			results = results.filter((property) =>
				property.propertyCourse.some((course) =>
					course.course_type?.some((ct) =>
						selectedFilters.courseTypes.includes(ct.value)
					)
				)
			);
		}

		if (selectedFilters.states.length) {
			results = results.filter((p) =>
				selectedFilters.states.includes(p.location?.state)
			);
		}

		if (selectedFilters.cities.length) {
			results = results.filter((p) =>
				selectedFilters.cities.includes(p.location?.city)
			);
		}

		if (selectedFilters.collegeTypes.length) {
			results = results.filter((p) =>
				p.college_or_university_type?.some((type) =>
					selectedFilters.collegeTypes.includes(type.value)
				)
			);
		}

		setFilteredProperties(results);
	}, [selectedFilters, mergedData]);

	// Search filters
	useEffect(() => {
		const value = searchPropertyCourse.toLowerCase();
		setFilterPropertyCourseData(
			propertyCourse.filter(
				(c) =>
					c.name?.[0]?.value?.toLowerCase?.().includes(value) ||
					c.short_name?.toLowerCase?.().includes(value)
			)
		);
	}, [searchPropertyCourse, propertyCourse]);

	useEffect(() => {
		const value = searchPropertyState.toLowerCase();
		setFilterPropertyStateData(
			propertyLocation.filter((loc) =>
				loc.state?.toLowerCase?.().includes(value)
			)
		);
	}, [searchPropertyState, propertyLocation]);

	useEffect(() => {
		const value = searchPropertyCity.toLowerCase();
		setFilterPropertyCityData(
			propertyLocation.filter((loc) =>
				loc.city?.toLowerCase?.().includes(value)
			)
		);
	}, [searchPropertyCity, propertyLocation]);

	useEffect(() => {
		const value = searchPropertyCollegeType.toLowerCase();
		setFilterPropertyCollegeTypeData(
			mergedData.filter((c) =>
				c.college_or_university_type?.[0]?.value
					?.toLowerCase?.()
					.includes(value)
			)
		);
	}, [searchPropertyCollegeType, mergedData]);

	const slugify = (text: string) =>
		text
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\-]+/g, "");

	if (loading) return <Loader />;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">
				List of Top Colleges In India
			</h1>
			<div className="flex flex-col lg:flex-row gap-8">
				<aside className="w-full lg:w-1/4">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Filters
						</h3>

						{/* Courses Filter */}
						<div className="mb-6">
							<button
								onClick={() => toggleSection("courses")}
								className="flex items-center justify-between w-full mb-2"
							>
								<h3 className="text-lg font-semibold text-gray-900">Courses</h3>
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										expandedSections.courses ? "rotate-180" : ""
									}`}
								/>
							</button>
							{expandedSections.courses && (
								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search courses..."
											className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
											value={searchPropertyCourse}
											onChange={(e) => setSearchPropertyCourse(e.target.value)}
										/>
									</div>
									<div className="max-h-40 overflow-auto">
										{filterPropertyCourseData.length > 0 ? (
											<>
												{[
													...new Map(
														filterPropertyCourseData.map((course) => [
															course.name[0]?.value,
															course,
														])
													).values(),
												].map((course) => (
													<label
														key={course.uniqueId}
														className="flex items-center space-x-2 cursor-pointer mb-2 hover:text-indigo-600 transition duration-300 ease-in-out"
													>
														<input
															type="checkbox"
															className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
															checked={selectedFilters.courses.includes(
																course.name[0]?.value
															)}
															onChange={() =>
																handleFilterChange(
																	"courses",
																	course.name[0]?.value
																)
															}
														/>
														<span className="text-gray-700 text-sm">
															{course.short_name}
														</span>
													</label>
												))}
											</>
										) : (
											<p>No course available</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* State Filter */}
						<div className="mb-6">
							<button
								onClick={() => toggleSection("states")}
								className="flex items-center justify-between w-full mb-2"
							>
								<h3 className="text-lg font-semibold text-gray-900">State</h3>
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										expandedSections.states ? "rotate-180" : ""
									}`}
								/>
							</button>
							{expandedSections.states && (
								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search states..."
											className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
											value={searchPropertyState}
											onChange={(e) => setSearchPropertyState(e.target.value)}
										/>
									</div>
									<div className="max-h-40 overflow-auto">
										{filterPropertyStateData.length > 0 ? (
											<>
												{[
													...new Map(
														filterPropertyStateData.map((state) => [
															state.state,
															state,
														])
													).values(),
												].map((state) => (
													<label
														key={state.uniqueId}
														className="flex items-center space-x-2 cursor-pointer mb-2"
													>
														<input
															type="checkbox"
															className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
															checked={selectedFilters.states.includes(
																state.state
															)}
															onChange={() =>
																handleFilterChange("states", state.state)
															}
														/>
														<span className="text-gray-700 text-sm">
															{state.state}
														</span>
													</label>
												))}
											</>
										) : (
											<p>No state available</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Cities Filter */}
						<div className="mb-6">
							<button
								onClick={() => toggleSection("cities")}
								className="flex items-center justify-between w-full mb-2"
							>
								<h3 className="text-lg font-semibold text-gray-900">City</h3>
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										expandedSections.cities ? "rotate-180" : ""
									}`}
								/>
							</button>
							{expandedSections.cities && (
								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search cities..."
											className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
											value={searchPropertyCity}
											onChange={(e) => setSearchPropertyCity(e.target.value)}
										/>
									</div>
									<div className="max-h-40 overflow-auto">
										{filterPropertyCityData.length > 0 ? (
											<>
												{[
													...new Map(
														filterPropertyCityData.map((city) => [
															city.city,
															city,
														])
													).values(),
												].map((city) => (
													<label
														key={city.uniqueId}
														className="flex items-center space-x-2 cursor-pointer mb-2"
													>
														<input
															type="checkbox"
															className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
															checked={selectedFilters.cities.includes(
																city.city
															)}
															onChange={() =>
																handleFilterChange("cities", city.city)
															}
														/>
														<span className="text-gray-700 text-sm">
															{city.city}
														</span>
													</label>
												))}
											</>
										) : (
											<p>No city available</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Course Type Filter */}
						<div className="mb-6">
							<button
								onClick={() => toggleSection("course_type")}
								className="flex items-center justify-between w-full mb-2"
							>
								<h3 className="text-lg font-semibold text-gray-900">
									Course Type
								</h3>
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										expandedSections.course_type ? "rotate-180" : ""
									}`}
								/>
							</button>
							{expandedSections.course_type && (
								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search course type..."
											className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
										/>
									</div>
									<div className="max-h-40 overflow-auto">
										{filterPropertyCourseData.length > 0 ? (
											<>
												{[
													...new Map(
														filterPropertyCourseData.map((course) => [
															course.course_type[0]?.value,
															course,
														])
													).values(),
												].map((course) => (
													<label
														key={course.uniqueId}
														className="flex items-center space-x-2 cursor-pointer mb-2"
													>
														<input
															type="checkbox"
															className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
															checked={selectedFilters.courseTypes.includes(
																course.course_type[0]?.value
															)}
															onChange={() =>
																handleFilterChange(
																	"courseTypes",
																	course.course_type[0]?.value
																)
															}
														/>
														<span className="text-gray-700 text-sm">
															{course.course_type[0]?.value}
														</span>
													</label>
												))}
											</>
										) : (
											<p>No course type available</p>
										)}
									</div>
								</div>
							)}
						</div>

						{/* College Type Filter */}
						<div className="mb-6">
							<button
								onClick={() => toggleSection("college_type")}
								className="flex items-center justify-between w-full mb-2"
							>
								<h3 className="text-lg font-semibold text-gray-900">
									College Type
								</h3>
								<ChevronDown
									className={`h-5 w-5 transition-transform ${
										expandedSections.college_type ? "rotate-180" : ""
									}`}
								/>
							</button>
							{expandedSections.college_type && (
								<div className="space-y-2">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
										<input
											type="text"
											placeholder="Search college type..."
											className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
											value={searchPropertyCollegeType}
											onChange={(e) =>
												setSearchPropertyCollegeType(e.target.value)
											}
										/>
									</div>
									<div className="max-h-40 overflow-auto">
										{filterPropertyCollegeTypeData.length > 0 ? (
											<>
												{[
													...new Map(
														filterPropertyCollegeTypeData.map((college) => [
															college.college_or_university_type[0]?.value,
															college,
														])
													).values(),
												].map((college) => (
													<label
														key={college.uniqueId}
														className="flex items-center space-x-2 cursor-pointer mb-2"
													>
														<input
															type="checkbox"
															className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
															checked={selectedFilters.collegeTypes.includes(
																college.college_or_university_type[0]?.value
															)}
															onChange={() =>
																handleFilterChange(
																	"collegeTypes",
																	college.college_or_university_type[0]?.value
																)
															}
														/>
														<span className="text-gray-700 text-sm">
															{college.college_or_university_type[0]?.value}
														</span>
													</label>
												))}
											</>
										) : (
											<p>No college type available</p>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</aside>
				<main className="flex-1">
					<div className="space-y-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold text-gray-900">
								Showing {filteredProperties.length} colleges
							</h2>
						</div>

						<div className="grid gap-6">
							{filteredProperties.map((college) => (
								<div
									key={college.uniqueId}
									className="bg-white rounded-lg shadow-md overflow-hidden"
								>
									<div className="flex flex-col md:flex-row">
										<div className="md:w-1/3">
											<img
												src={`${process.env.NEXT_PUBLIC_API_URL}/${college.featured_image}`}
												alt={college.featured_image}
												className="h-48 w-full object-cover md:h-full"
											/>
										</div>
										<div className="p-6 md:w-2/3">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-xl font-bold text-gray-900">
														[{college.short_name}] - {college.property_name}
													</h3>
													<p className="text-gray-600 flex my-3">
														<MapPin className="h-5 w-5 me-1 text-sm" />
														{college.location?.city}, {college.location?.state}
													</p>
												</div>
												<div className="flex items-center">
													<Star className="h-5 w-5 text-yellow-400 fill-current" />
													<span className="ml-1 text-gray-900">
														{college.reviews.length > 0
															? (
																	college.reviews.reduce(
																		(sum, review) => sum + review.rating,
																		0
																	) / college.reviews.length
															  ).toFixed(1)
															: "N/A"}
													</span>
												</div>
											</div>

											<p className="text-sm text-gray-800">
												Type -{" "}
												{Array.isArray(college?.college_or_university_type)
													? college.college_or_university_type
															.map((item) => item.value)
															.join(", ")
													: "N/A"}{" "}
												|{" Approved by - "}
												{Array.isArray(college?.affiliated_by)
													? college.affiliated_by
															.map((item) => item.value)
															.join(", ")
													: "N/A"}{" "}
											</p>

											<div className="mt-4">
												<h4 className="text-sm font-semibold text-gray-900">
													+{college?.propertyCourse?.length - 1} Courses
												</h4>
											</div>

											<div className="mt-4 flex float-end">
												<Link
													href={`/${college?.property_type?.toLowerCase()}/${
														college?.uniqueId
													}/${slugify(college?.property_name || "")}/${slugify(
														college?.location?.city || ""
													)}`}
													target="blank"
												>
													<button className="inline-flex me-1 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition duration-300 ease-in-out">
														View Details
													</button>
												</Link>
												<button className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md shadow-sm text-indigo-600 hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition duration-300 ease-in-out">
													Brochure
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

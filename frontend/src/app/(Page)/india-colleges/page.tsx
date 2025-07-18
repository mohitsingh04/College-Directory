"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, ChevronDown, Star, MapPin } from "lucide-react";
import API from "@/services/API/API";
import { useSearchParams } from "next/navigation";
import Loader from "@/Components/Loader/Loader";
import Link from "next/link";

interface Review {
	rating: number;
}

interface Property {
	property_name: string;
	short_name: string;
	property_type: string;
	uniqueId: number;
	featured_image: string;
	reviews: Review[];
	college_or_university_type: { value: string }[];
	location: {
		city: string;
		state: string;
	};
	affiliated_by: any;
	propertyCourse: any[];
}

interface PropertyCourse {
	uniqueId: number;
	name: { value: string }[];
	short_name: string;
	course_type: { value: string }[];
}

interface PropertyLocation {
	uniqueId: number;
	city: string;
	state: string;
}

interface PropertyCategory {
	uniqueId: number;
	category_name: string;
	parent_category: string;
}

interface Filters {
	courses: string[];
	states: string[];
	cities: string[];
	courseTypes: string[];
	collegeTypes: string[];
}

export default function IndiaColleges() {
	const searchParams = useSearchParams();
	const [propertyData, setPropertyData] = useState<Property[]>([]);
	const [mergedData, setMergedData] = useState<Property[]>([]);
	const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
	const [propertyCourse, setPropertyCourse] = useState<PropertyCourse[]>([]);
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(
		[]
	);
	const [propertyCategory, setPropertyCategory] = useState<PropertyCategory[]>(
		[]
	);
	const [loading, setLoading] = useState(true);

	// Search states
	const [searchPropertyCourse, setSearchPropertyCourse] = useState("");
	const [searchPropertyState, setSearchPropertyState] = useState("");
	const [searchPropertyCity, setSearchPropertyCity] = useState("");
	const [searchPropertyCollegeType, setSearchPropertyCollegeType] =
		useState("");

	// Filter data states
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

	// Selected filters
	const [selectedFilters, setSelectedFilters] = useState<Filters>({
		courses: [],
		states: [],
		cities: [],
		courseTypes: [],
		collegeTypes: [],
	});

	// Fetch Property Data
	const fetchPropertyData = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/property");
			const filteredPropertyData = response.data;
			setPropertyData(filteredPropertyData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch Course Data
	const fetchPropertyDataCourse = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/property-course");
			const filteredPropertyCourseData = response.data;
			setPropertyCourse(filteredPropertyCourseData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch Location Data
	const fetchPropertyDataLocation = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/location");
			const filteredPropertyLocationData = response.data;
			setPropertyLocation(filteredPropertyLocationData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch Category Data
	const fetchPropertyDataCategory = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/category");
			const filteredPropertyCategoryData = response.data;
			setPropertyCategory(filteredPropertyCategoryData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch Merged Data
	useEffect(() => {
		const fetchAndMergeData = async () => {
			try {
				setLoading(true);
				const propertyResponse = await API.get("/property");
				const locationResponse = await API.get("/location");
				const reviewsResponse = await API.get("/reviews");
				const propertyCourseResponse = await API.get("/property-course");

				const propertyList = propertyResponse?.data?.filter((property: any)=>property.status === "Active") || [];
				const locationList = locationResponse?.data || [];
				const reviewsList = reviewsResponse?.data || [];
				const propertyCourseList = propertyCourseResponse?.data || [];

				const locationMap = new Map(
					locationList.map((loc: any) => [loc.propertyId, loc])
				);
				const reviewsMap = new Map();
				reviewsList.forEach((rew: any) => {
					if (!reviewsMap.has(rew.propertyId)) {
						reviewsMap.set(rew.propertyId, []);
					}
					reviewsMap.get(rew.propertyId).push(rew);
				});
				const propertyCourseMap = new Map();
				propertyCourseList.forEach((course: any) => {
					if (!propertyCourseMap.has(course.propertyId)) {
						propertyCourseMap.set(course.propertyId, []);
					}
					propertyCourseMap.get(course.propertyId).push(course);
				});

				const merged = propertyList.map((property: any) => ({
					...property,
					location: locationMap.get(property.uniqueId) || null,
					reviews: reviewsMap.get(property.uniqueId) || [],
					propertyCourse: propertyCourseMap.get(property.uniqueId) || [],
				}));

				setMergedData(merged);
				setFilteredProperties(merged);
			} catch (error: any) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAndMergeData();
	}, []);

	useEffect(() => {
		fetchPropertyData();
		fetchPropertyDataCourse();
		fetchPropertyDataLocation();
		fetchPropertyDataCategory();
	}, [
		fetchPropertyData,
		fetchPropertyDataCourse,
		fetchPropertyDataLocation,
		fetchPropertyDataCategory,
	]);

	// Handle filter changes
	const handleFilterChange = (filterType: keyof Filters, value: string) => {
		setSelectedFilters((prev) => {
			const newFilters = { ...prev };
			if (newFilters[filterType].includes(value)) {
				newFilters[filterType] = newFilters[filterType].filter(
					(item) => item !== value
				);
			} else {
				newFilters[filterType] = [...newFilters[filterType], value];
			}
			return newFilters;
		});
	};

	// Apply all filters
	useEffect(() => {
		let filtered = [...mergedData];

		// Filter by courses
		if (selectedFilters.courses.length > 0) {
			filtered = filtered.filter((property) =>
				property.propertyCourse.some((course: any) =>
					selectedFilters.courses.includes(course.name[0]?.value)
				)
			);
		}

		// Filter by states
		if (selectedFilters.states.length > 0) {
			filtered = filtered.filter((property) =>
				selectedFilters.states.includes(property.location?.state)
			);
		}

		// Filter by cities
		if (selectedFilters.cities.length > 0) {
			filtered = filtered.filter((property) =>
				selectedFilters.cities.includes(property.location?.city)
			);
		}

		// Filter by college types
		if (selectedFilters.collegeTypes.length > 0) {
			filtered = filtered.filter((property) =>
				property.college_or_university_type.some((type) =>
					selectedFilters.collegeTypes.includes(type.value)
				)
			);
		}

		setFilteredProperties(filtered);
	}, [selectedFilters, mergedData]);

	// Fiter Course
	useEffect(() => {
		const filteredData = propertyCourse?.filter((course) => {
			const searchValue = searchPropertyCourse?.toLowerCase();
			const nameMatch = course.name?.[0]?.value
				?.toLowerCase()
				?.includes(searchValue);
			const shortNameMatch = course?.short_name
				?.toLowerCase()
				.includes(searchValue);
			return nameMatch || shortNameMatch;
		});
		setFilterPropertyCourseData(filteredData);
	}, [propertyCourse, searchPropertyCourse]);

	// Fiter State
	useEffect(() => {
		const searchValue = searchPropertyState.toLowerCase();
		const filteredData = propertyLocation.filter((propertyState) => {
			const nameMatch = propertyState.state
				?.toLowerCase()
				.includes(searchValue);
			return nameMatch;
		});
		setFilterPropertyStateData(filteredData);
	}, [propertyLocation, searchPropertyState]);

	// Fiter City
	useEffect(() => {
		const searchValue = searchPropertyCity.toLowerCase();
		const filteredData = propertyLocation.filter((propertyCity) => {
			const nameMatch = propertyCity.city?.toLowerCase().includes(searchValue);
			return nameMatch;
		});
		setFilterPropertyCityData(filteredData);
	}, [propertyLocation, searchPropertyCity]);

	// Fiter College Type
	useEffect(() => {
		const filteredData = propertyData.filter((property) => {
			const searchValue = searchPropertyCollegeType.toLowerCase();
			const nameMatch = property.college_or_university_type[0]?.value
				?.toLowerCase()
				.includes(searchValue);
			console.log(nameMatch);
			return nameMatch;
		});
		setFilterPropertyCollegeTypeData(filteredData);
	}, [propertyData, searchPropertyCollegeType]);

	const [expandedSections, setExpandedSections] = useState({
		courses: true,
		states: true,
		cities: true,
		course_type: true,
		college_type: true,
	});

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	if (loading) {
		return <Loader />;
	}

	const slugify = (text: string) =>
		text
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^\w\-]+/g, "");

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

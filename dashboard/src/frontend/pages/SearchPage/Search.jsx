import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { API } from "../../../services/API";
import toast from "react-hot-toast";

const colleges = [
    {
        id: 1,
        name: "IIT Madras - Indian Institute of Technology",
        location: "Chennai, Tamil Nadu",
        accreditation: "AICTE Accredited",
        rating: 8.3,
        reviews: 48,
        image: "https://via.placeholder.com/150",
        courses: [
            { name: "BE/B.Tech", fee: "₹2.42 Lakhs" },
            { name: "ME/M.Tech", fee: "₹24.6 K" },
        ],
    },
    {
        id: 2,
        name: "IIMA - Indian Institute of Management",
        location: "Ahmedabad, Gujarat",
        accreditation: "UGC Accredited",
        rating: 9.1,
        reviews: 60,
        image: "https://via.placeholder.com/150",
        courses: [
            { name: "Executive MBA", fee: "₹34.5 Lakhs" },
            { name: "MBA/PGDM", fee: "₹26.5 Lakhs" },
        ],
    },
];

export default function Search() {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);
    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        const fetchAndMergeData = async () => {
            try {
                const propertyResponse = await API.get("/get-property-list");
                const locationResponse = await API.get("/get-property-location");
                const reviewsResponse = await API.get("/reviews");

                const propertyList = propertyResponse?.data || [];
                const locationList = locationResponse?.data || [];
                const reviewsList = reviewsResponse?.data || [];

                const locationMap = new Map(locationList.map(loc => [loc.propertyId, loc]));
                const reviewsMap = new Map();
                reviewsList.forEach(rew => {
                    if (!reviewsMap.has(rew.propertyId)) {
                        reviewsMap.set(rew.propertyId, []);
                    }
                    reviewsMap.get(rew.propertyId).push(rew);
                });

                const merged = propertyList.map((property) => ({
                    ...property,
                    location: locationMap.get(property.uniqueId) || null,
                    reviews: reviewsMap.get(property.uniqueId) || [],
                }));

                setMergedData(merged);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchAndMergeData();
    }, []);


    const courses = ["MBA/PGDM", "B.Sc", "B.Com", "BA", "BBA/BBM", "BE/B.Tech"];
    const states = ["Maharashtra", "Tamil Nadu", "Gujarat"];

    const handleCourseChange = (course) => {
        setSelectedCourses((prev) =>
            prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]
        );
    };

    const handleStateChange = (state) => {
        setSelectedStates((prev) =>
            prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
        );
    };

    const filteredColleges = colleges.filter((college) => {
        const matchesCourse =
            selectedCourses.length === 0 ||
            college.courses.some((c) => selectedCourses.includes(c.name));
        const matchesState =
            selectedStates.length === 0 || selectedStates.some((s) => college.location.includes(s));

        return matchesCourse && matchesState;
    });

    const totalRatings = mergedData[1]?.reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = mergedData[1]?.reviews?.length > 0 ? (totalRatings / mergedData[1]?.reviews?.length).toFixed(1) : 0;

    return (
        <Fragment>
            <Navbar />
            <section className="container">
                <div className="flex min-h-screen bg-gray-100 p-4">
                    {/* Sidebar Filters */}
                    <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
                        {/* <h2 className="text-xl font-bold mb-4">Filters</h2>

                        <div className="mb-4">
                            <h3 className="font-semibold">Course</h3>
                            <div className="mt-2">
                                {courses.map((course) => (
                                    <label key={course} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCourses.includes(course)}
                                            onChange={() => handleCourseChange(course)}
                                        />
                                        <span>{course}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold">State</h3>
                            <div className="mt-2">
                                {states.map((state) => (
                                    <label key={state} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedStates.includes(state)}
                                            onChange={() => handleStateChange(state)}
                                        />
                                        <span>{state}</span>
                                    </label>
                                ))}
                            </div>
                        </div> */}
                    </div>

                    {/* College List */}
                    <div className="w-3/4 pl-6">
                        {mergedData.length > 0 ? (
                            mergedData.map((college) => (
                                <div key={college.uniqueId} className="bg-white p-4 rounded-lg shadow-md mb-4 flex">
                                    <img src={`${import.meta.env.VITE_API_URL}${college.featured_image}`} alt={college.property_name} className="w-40 h-32 rounded-lg" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-bold">{college.property_name} - ({college.short_name})</h3>
                                        <p className="text-gray-600">{college.location?.city}, {college.location?.state}</p>
                                        <p className="text-sm text-gray-800">
                                            {Array.isArray(college?.affiliated_by)
                                                ? college.affiliated_by.map((item) => item.value).join(", ")
                                                : "N/A"}{" "}
                                            {"Approved"}
                                        </p>
                                        <p className="font-medium">
                                            ⭐ {college.reviews.length > 0
                                                ? (college.reviews.reduce((sum, review) => sum + review.rating, 0) / college.reviews.length).toFixed(1)
                                                : "N/A"} / 5
                                            ({college.reviews.length} Reviews)
                                        </p>

                                        <div className="mt-3">
                                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                                Apply Now
                                            </button>
                                            <button className="border px-4 py-2 rounded-md">Brochure</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No colleges found.</p>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </Fragment>
    )
};

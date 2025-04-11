import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaMapMarkerAlt } from "react-icons/fa";
import { API } from "../../services/API";
import toast from "react-hot-toast";

export default function HomePage() {
    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        const fetchAndMergeData = async () => {
            try {
                const propertyResponse = await API.get("/get-property-list");
                const propertyList = propertyResponse.data;

                const locationResponse = await API.get("/get-property-location");
                const locationList = locationResponse.data;

                const merged = propertyList.map((property) => {
                    const location = locationList.find(
                        (loc) => loc.propertyId === property.uniqueId
                    );
                    return {
                        ...property,
                        location: location || null,
                    };
                });

                setMergedData(merged);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchAndMergeData();
    }, []);

    return (
        <Fragment>
            <Navbar />
            {/* {mergedData.map((items) => (
                <div className="flex justify-center">
                    <div className="border rounded-lg shadow-md p-4 bg-white w-full max-w-3xl my-5">
                        <div className="flex gap-4">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${items.featured_image}`}
                                alt="IIMA Campus"
                                className="w-32 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${items.logo}`}
                                        alt="IIMA Logo"
                                        className="w-8 h-8"
                                    />
                                    <h2 className="text-lg font-semibold">{items.short_name} - {items.property_name}</h2>
                                </div>
                                <p className="text-gray-500 flex items-center gap-1 text-sm">
                                    <FaMapMarkerAlt /> {items.location?.city}, {items.location?.state} | {items?.affiliated_by[0]?.value}
                                </p>
                                <div className="mt-2 grid grid-cols-2 text-sm border-t pt-2">
                                    <span className="font-semibold">Course Fees</span>
                                    <span className="font-semibold">Admission</span>
                                    <span>Executive MBA</span>
                                    <span className="text-gray-700 font-medium">₹ 34.5 Lakhs</span>
                                    <span>MBA/PGDM</span>
                                    <span className="text-gray-700 font-medium">₹ 26.5 Lakhs</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">
                                    CWUR ranking 421 out of 2000 in 2022
                                </p>
                                <div className="mt-3 flex gap-3">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                                        Apply Now
                                    </button>
                                    <button className="border px-4 py-2 rounded-md text-sm font-medium">
                                        Brochure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))} */}
            
            {/* Hero Section 2 */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 mb-6 lg:mb-0">
                            <div>
                                <h5 className="text-gray-900 mb-4 flex items-center">
                                    <span className="bg-green-100 text-green-600 rounded-full p-2 mr-2">✔</span>
                                    Most trusted education platform
                                </h5>
                                <h1 className="text-4xl font-bold mb-3">
                                    Grow your skills and advance your career
                                </h1>
                                <p className="mb-5">
                                    Start, switch, or advance your career with more than 5,000 courses,
                                    Professional Certificates, and degrees from world-class universities and companies.
                                </p>
                                <div className="flex items-center">
                                    <a href="#" className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700">Join Free Now</a>
                                    <a
                                        href="https://www.youtube.com/watch?v=JRzWRZahOVU"
                                        className="flex items-center text-gray-800 text-lg ml-3 hover:text-gray-600"
                                    >
                                        <img width="50" height="50" src="https://img.icons8.com/flat-round/50/play--v1.png" alt="Play" className="mr-2" />
                                        Watch Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 flex justify-center relative">
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/bg-thumb.svg" alt="Background" className="relative" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/girl-image.png" alt="Girl" className="absolute bottom-0 right-0" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/frame-1.svg" alt="Frame 1" className="absolute top-0 -left-10" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/frame-2.svg" alt="Frame 2" className="absolute bottom-0 -left-8" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/target.svg" alt="Target" className="absolute bottom-8 -left-5" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/sound.svg" alt="Sound" className="absolute top-18 -left-9" />
                            <img src="https://geeksui.codescandy.com/geeks/assets/images/background/acedamy-img/trophy.svg" alt="Trophy" className="absolute top-0 -left-6" />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </Fragment>
    )
}

import { Fragment, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Search, X, GraduationCap } from 'lucide-react';
import { Link } from "react-router-dom";
import { API } from "../../services/API";

export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mergedData, setMergedData] = useState([]);

    const trendingSearches = [
        "Upcoming Exams",
        "IIT in Colleges",
        "CAT in Exams",
        "CAT Cutoff in News",
        "MBA Colleges in Delhi/NCR",
        "MCA Colleges in Delhi/NCR"
    ];

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

    useEffect(() => {
        if (search.trim() !== '') {
            const filterData = mergedData.filter((item) =>
                item.property_name.toLowerCase().includes(search.toLowerCase()) ||
                item.short_name.toLowerCase().includes(search.toLowerCase()) ||
                item.location?.city.toLowerCase().includes(search.toLowerCase()) ||
                item.location?.state.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(filterData);
        } else {
            setFilteredData([]);
        }
    }, [search, mergedData]);

    return (
        <Fragment>
            <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                <Search className="w-6 h-6 text-gray-600" />
            </button>

            {/* Full screen search overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Search header */}
                        <div className="py-4 flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg">
                                <Search className="w-6 h-6 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search for Colleges, Exams, News and more"
                                    className="flex-1 bg-transparent outline-none text-lg"
                                    value={search}
                                    // onChange={(e) => setSearch(e.target.value)}
                                    onChange={(e) => setSearch(e.target.value.trimStart().replace(/\s+/g, " "))}
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setIsSearchOpen(false);
                                    setSearch("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Content area */}
                        <div className="mt-0">
                            {search ? (
                                /* Search results */
                                <>
                                    {search.length >= 3 ? (
                                        <>
                                            {filteredData.map((property) => (
                                                <div key={property.uniqueId} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-200 rounded-lg">
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}${property.logo}`}
                                                        alt={property.logo}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            <Link onClick={() => setIsSearchOpen(false)} to={`/${property?.property_type?.toLowerCase()}/${property?.uniqueId}/${property?.property_name?.replace(/\s+/g, "-").toLowerCase()}/${property?.location?.city?.replace(/\s+/g, "-").toLowerCase()}`} className="cursor-pointer hover:underline">{property.property_name} - [{property.short_name}]</Link>
                                                        </h3>
                                                        {property?.location?.city.length > 0 ? (
                                                            <p className="text-gray-600">{property?.location?.city}, {property?.location?.state}</p>
                                                        ) : (
                                                            null
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <GraduationCap className="w-5 h-5" />
                                                        <span>{property.property_type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {filteredData.length === 0 && (
                                                <p className="text-gray-500 text-center py-8">No results found for "{search}"</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-purple-600">Type 3 or more characters for search results</h4>
                                            <hr />
                                            <h2 className="text-xl font-semibold text-orange-500 mb-4">
                                                TRENDING SEARCHES
                                            </h2>
                                            <ul className="space-y-4">
                                                {trendingSearches.map((search, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-gray-700 hover:text-gray-900 cursor-pointer"
                                                        onClick={() => setSearch(search)}
                                                    >
                                                        {search}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </>
                            ) : (
                                /* Trending searches */
                                <>
                                    <h2 className="text-xl font-semibold text-orange-500 mb-4">
                                        TRENDING SEARCHES
                                    </h2>
                                    <ul className="space-y-4">
                                        {trendingSearches.map((search, index) => (
                                            <li
                                                key={index}
                                                className="text-gray-700 hover:text-gray-900 cursor-pointer"
                                                onClick={() => setSearch(search)}
                                            >
                                                {search}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

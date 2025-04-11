"use client";
import React, { useState } from "react";

const careerPaths = [
	{ name: "Architecture", colleges: 15, icon: "🏗️" },
	{ name: "Commerce", colleges: 41, icon: "🛒" },
	{ name: "Computer Application", colleges: 63, icon: "💻" },
	{ name: "Dental", colleges: 3, icon: "🦷" },
	{ name: "Design", colleges: 25, icon: "👗" },
	{ name: "Hotel Management", colleges: 21, icon: "🍽️" },
	{ name: "Law", colleges: 20, icon: "⚖️" },
	{ name: "Mass Communication", colleges: 34, icon: "📰" },
	{ name: "Medical", colleges: 40, icon: "💊" },
	{ name: "Paramedical", colleges: 19, icon: "🚑" },
	{ name: "Science", colleges: 75, icon: "🧪" },
	{ name: "Veterinary Sciences", colleges: 4, icon: "🐾" },
];

const CareerPathSection = () => {
	const [activeTab, setActiveTab] = useState("Colleges");

	return (
		<section className="text-center py-10">
			<h3 className="text-gray-800 font-medium">
				Don't limit yourself to one option
			</h3>
			<h2 className="text-3xl font-bold mt-1">Explore your career path</h2>
			<div className="mt-4">
				<button
					className={`px-5 py-2 rounded-full mx-2 ${
						activeTab === "Colleges"
							? "bg-blue-600 text-white"
							: "bg-gray-200 text-gray-700"
					}`}
					onClick={() => setActiveTab("Colleges")}
				>
					Colleges
				</button>
				<button
					className={`px-5 py-2 rounded-full mx-2 ${
						activeTab === "Location"
							? "bg-blue-600 text-white"
							: "bg-gray-200 text-gray-700"
					}`}
					onClick={() => setActiveTab("Location")}
				>
					Location
				</button>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8 px-6">
				{careerPaths.map((path, index) => (
					<div
						key={index}
						className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
					>
						<div className="text-4xl">{path.icon}</div>
						<h4 className="font-semibold mt-2 text-gray-700">{path.name}</h4>
						<p className="text-gray-500">{path.colleges} Colleges</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default CareerPathSection;

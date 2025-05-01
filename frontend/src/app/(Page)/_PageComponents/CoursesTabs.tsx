"use client";

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BookOpen, Clock, IndianRupee, GraduationCap } from "lucide-react";

interface PropertyCourses {
	name: { value: string }[];
	duration: string;
	course_fees: string;
	eligibility: string;
}

export function CoursesTab() {
	const { id } = useParams();
	const [propertyCourses, setPropertyCourses] = useState<PropertyCourses[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyCourses = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/property-course");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyCourses(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyCourses();
	}, [fetchPropertyCourses]);

	if (loading) {
		return (
			<div className="min-h-[400px] flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fadeIn">
			{/* Header */}
			<div className="flex items-center gap-2 border-b pb-4">
				<BookOpen className="text-indigo-600" size={24} />
				<h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
			</div>

			{/* Courses Grid */}
			<div className="grid gap-6">
				{propertyCourses.map((course, index) => (
					<div
						key={index}
						className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
					>
						<div className="p-6">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
								{/* Course Name and Duration */}
								<div className="space-y-2">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
										<GraduationCap className="text-indigo-600" size={20} />
										{course?.name && course.name[0] && course.name[0].value}
									</h3>
									<div className="flex items-center gap-2 text-gray-600">
										<Clock size={16} />
										<span>{course?.duration}</span>
									</div>
								</div>

								{/* Fees and Eligibility */}
								<div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
									<div className="flex items-center gap-2 text-gray-900">
										<IndianRupee size={16} className="text-indigo-600" />
										<span className="font-medium">{course?.course_fees}</span>
									</div>
									{/* <div className="px-4 py-2 bg-indigo-50 rounded-full">
										<span className="text-sm text-indigo-700">
											Eligibility: {course?.eligibility}
										</span>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{propertyCourses.length === 0 && (
				<div className="text-center py-12">
					<GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-2 text-sm font-semibold text-gray-900">
						No courses found
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						No courses are currently available for this institution.
					</p>
				</div>
			)}
		</div>
	);
}

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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

	const courses = [
		{
			name: "B.Tech Computer Science",
			duration: "4 Years",
			fees: "₹2.5 Lakhs/year",
			seats: 120,
		},
		{
			name: "BBA",
			duration: "3 Years",
			fees: "₹1.8 Lakhs/year",
			seats: 60,
		},
		{
			name: "MBA",
			duration: "2 Years",
			fees: "₹3.2 Lakhs/year",
			seats: 60,
		},
	];

	return (
		<div className="space-y-6">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
								Course Name
							</th>
							<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
								Duration
							</th>
							<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
								Annual Fees
							</th>
							<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
								Eligibilty
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{propertyCourses.map((course, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-6 py-4 text-sm text-gray-900">
									{course?.name && course.name[0] && course.name[0].value}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{course?.duration}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{course?.course_fees}
								</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									{course?.eligibility}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

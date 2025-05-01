import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyScholarship {
	scholarship: string;
}

export default function ScholarshipTab() {
	const { id } = useParams();
	const [propertyScholarship, setPropertyScholarship] = useState<
		PropertyScholarship[]
	>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyScholarship = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/scholarship");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyScholarship(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyScholarship();
	}, [fetchPropertyScholarship]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="bg-white p-6">
						<div
							className="text-gray-700 text-base leading-relaxed"
							dangerouslySetInnerHTML={{
								__html: propertyScholarship[0]?.scholarship,
							}}
						/>
					</div>
				</>
			)}
		</>
	);
}

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyDetails {
	short_description: string;
	full_description: string;
}

export function InfoTab() {
	const { id } = useParams();
	const [propertyDetails, setPropertyDetails] = useState<PropertyDetails[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyDetails = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/otherBasicDetails");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyDetails(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyDetails();
	}, [fetchPropertyDetails]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2">About University</h3>
							<p
								className="text-gray-600"
								dangerouslySetInnerHTML={{
									__html: propertyDetails?.[0].short_description,
								}}
							/>
						</div>

						<div>
							<h3 className="text-lg font-semibold mb-2">Campus Highlights</h3>
							<p
								dangerouslySetInnerHTML={{
									__html: propertyDetails?.[0].full_description,
								}}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}

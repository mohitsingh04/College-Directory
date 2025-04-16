import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyHostel {
	boys_hostel_fees: string;
	boys_hostel_description: string;
	girls_hostel_fees: string;
	girls_hostel_description: string;
}

export default function HostelTab() {
	const { id } = useParams();
	const [propertyHostel, setPropertyHostel] = useState<PropertyHostel[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyHostel = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/hostel");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyHostel(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyHostel();
	}, [fetchPropertyHostel]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="">
						{/* Boys Hostel Section */}
						<div className="mb-6 border-b pb-4">
							<h5 className="text-lg font-semibold text-gray-800">
								Boys Hostel Fees:{" "}
								<span className="font-normal">
									{propertyHostel[0]?.boys_hostel_fees}
								</span>
							</h5>
							<h6 className="text-md font-medium text-gray-700 mt-2">
								Boys Hostel Details:
							</h6>
							<div className="mt-2 text-gray-600 text-sm">
								<p
									className="leading-relaxed"
									dangerouslySetInnerHTML={{
										__html: propertyHostel[0]?.boys_hostel_description,
									}}
								/>
							</div>
						</div>

						{/* Girls Hostel Section */}
						<div>
							<h5 className="text-lg font-semibold text-gray-800">
								Girls Hostel Fees:{" "}
								<span className="font-normal">
									{propertyHostel[0]?.girls_hostel_fees}
								</span>
							</h5>
							<h6 className="text-md font-medium text-gray-700 mt-2">
								Girls Hostel Details:
							</h6>
							<div className="mt-2 text-gray-600 text-sm">
								<p
									className="leading-relaxed"
									dangerouslySetInnerHTML={{
										__html: propertyHostel[0]?.girls_hostel_description,
									}}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

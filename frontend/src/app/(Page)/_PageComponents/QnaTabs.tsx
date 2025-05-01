import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyQnA {
	answer: string;
	question: string;
}

export default function QnATab() {
	const { id } = useParams();
	const [propertyQnA, setPropertyQnA] = useState<PropertyQnA[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyQnA = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/questionandanswer");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyQnA(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyQnA();
	}, [fetchPropertyQnA]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="space-y-6">
						{propertyQnA.map((faq, index) => (
							<div
								key={index}
								className="p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
							>
								<h5 className="text-lg font-semibold text-gray-800 mb-2">
									{faq.question}
								</h5>
								<div
									className="text-gray-600 leading-relaxed"
									dangerouslySetInnerHTML={{ __html: faq.answer }}
								/>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
}

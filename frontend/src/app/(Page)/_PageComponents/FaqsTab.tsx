import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyFaqs {
	answer: string;
	question: string;
}

export default function FaqsTab() {
	const { id } = useParams();
	const [propertyFaqs, setPropertyFaqs] = useState<PropertyFaqs[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyFaqs = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/faqs");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyFaqs(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyFaqs();
	}, [fetchPropertyFaqs]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="space-y-6">
						{propertyFaqs.map((faq, index) => (
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

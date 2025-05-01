import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyAdmissionProcess {
	admission_process: string;
}

export default function AdmissionTab() {
	const { id } = useParams();
	const [propertyAdmissionProcess, setPropertyAdmissionProcess] = useState<
		PropertyAdmissionProcess[]
	>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyAdmissionProcess = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/otherBasicDetails");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyAdmissionProcess(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyAdmissionProcess();
	}, [fetchPropertyAdmissionProcess]);

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
								__html: propertyAdmissionProcess[0]?.admission_process,
							}}
						/>
					</div>
				</>
			)}
		</>
	);
}

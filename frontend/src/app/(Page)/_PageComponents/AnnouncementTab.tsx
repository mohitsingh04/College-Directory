import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

interface PropertyAnnouncement {
	announcement: string;
}

export default function AnnouncementTab() {
	const { id } = useParams();
	const [propertyAnnouncement, setPropertyAnnouncement] = useState<
		PropertyAnnouncement[]
	>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyAnnouncement = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/announcement");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyAnnouncement(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyAnnouncement();
	}, [fetchPropertyAnnouncement]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="bg-white p-6 rounded-xl shadow-md">
						<div
							className="text-gray-700 text-base leading-relaxed"
							dangerouslySetInnerHTML={{
								__html: propertyAnnouncement[0]?.announcement,
							}}
						/>
					</div>
				</>
			)}
		</>
	);
}

import Loader from "@/Components/Loader/Loader";
import API from "@/services/API/API";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

interface PropertyFaculty {
	designation: string;
	name: string;
	department: string;
}

export default function FacultyTab() {
	const { id } = useParams();
	const [propertyFaculty, setPropertyFaculty] = useState<PropertyFaculty[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchPropertyFaculty = useCallback(async () => {
		try {
			setLoading(true);
			const response = await API.get("/faculty");
			const filteredProperty = response?.data?.filter(
				(property: any) => property?.propertyId === Number(id)
			);
			setPropertyFaculty(filteredProperty);
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchPropertyFaculty();
	}, [fetchPropertyFaculty]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<Card>
						<Card.Body>
							<Row className="flex gap-1 flex-wrap">
								{propertyFaculty.map((faculty, index) => (
									<Col md={3} key={index}>
										<div className="flex flex-col items-center rounded-lg shadow-lg p-4 w-64">
											<div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
												<img
													width="25"
													height="25"
													src="https://img.icons8.com/pastel-glyph/100/person-male--v3.png"
													alt="person-male--v3"
												/>
											</div>
											<span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded mt-2">
												{faculty?.designation}
											</span>
											<h2 className="text-lg font-bold text-center mt-2">
												{faculty?.name}
											</h2>
											<p className="text-gray-500 text-sm">
												{faculty?.department}
											</p>
										</div>
									</Col>
								))}
							</Row>
						</Card.Body>
					</Card>
				</>
			)}
		</>
	);
}

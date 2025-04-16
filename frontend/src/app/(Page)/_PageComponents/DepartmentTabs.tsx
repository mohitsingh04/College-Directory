import React from "react";

export function DepartmentTab() {
	const departments = [
		{
			name: "School of Computer Science & Engineering",
			programs: ["B.Tech", "M.Tech", "PhD"],
			faculty: 45,
		},
		{
			name: "School of Management",
			programs: ["BBA", "MBA"],
			faculty: 30,
		},
		{
			name: "School of Law",
			programs: ["LLB", "LLM"],
			faculty: 25,
		},
	];

	return (
		<div className="space-y-6">
			{departments.map((dept, index) => (
				<div key={index} className="bg-gray-50 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{dept.name}
					</h3>
					<div className="space-y-2">
						<p className="text-gray-600">
							<span className="font-medium">Programs Offered:</span>{" "}
							{dept.programs.join(", ")}
						</p>
						<p className="text-gray-600">
							<span className="font-medium">Faculty Members:</span>{" "}
							{dept.faculty}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

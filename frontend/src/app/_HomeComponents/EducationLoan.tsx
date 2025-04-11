import React from "react";

const EducationLoan = () => {
	return (
		<section className="text-center py-12 px-6">
			{/* Header Section */}
			<h4 className="text-blue-600 text-lg">Helping on education funds</h4>
			<h2 className="text-blue-700 text-2xl md:text-3xl font-semibold mt-1">
				Education loan facility
			</h2>
			<h3 className="text-orange-600 text-2xl md:text-3xl font-bold mt-4">
				3 Simple steps to Apply for an Educational loan
			</h3>
			<p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
				Students can view, apply and track the education loan applications to
				banks anytime, anywhere by accessing the portal.
			</p>

			{/* Steps Section */}
			<div className="flex flex-col md:flex-row justify-center gap-10 mt-6">
				<div className="flex flex-col items-center">
					<img
						src="https://www.admissionjockey.com/v2/assets/images/site/Layer%2054.jpg"
						alt="Register Now"
						className="w-12 h-12"
					/>
					<p className="mt-2 text-gray-700 font-medium">Register Now</p>
				</div>
				<div className="flex flex-col items-center">
					<img
						src="https://www.admissionjockey.com/v2/assets/images/site/Layer%2055.jpg"
						alt="Fill up the form"
						className="w-12 h-12"
					/>
					<p className="mt-2 text-gray-700 font-medium">Fill up the form</p>
				</div>
				<div className="flex flex-col items-center">
					<img
						src="https://www.admissionjockey.com/v2/assets/images/site/Layer%2056.jpg"
						alt="Apply to multiple Banks"
						className="w-12 h-12"
					/>
					<p className="mt-2 text-gray-700 font-medium">
						Apply to multiple Banks
					</p>
				</div>
			</div>

			{/* CTA Buttons */}
			<div className="mt-6">
				<button className="bg-blue-700 text-white px-6 py-2 rounded-full text-lg font-semibold">
					Get Education Loan
				</button>
				<a href="#" className="text-blue-600 ml-4 text-lg">
					Education Loan Info
				</a>
			</div>
		</section>
	);
};

export default EducationLoan;

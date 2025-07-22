import React from "react";

const GuidanceSection = () => {
	return (
		<section className="bg-indigo-600 text-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center">
			{/* Left Content */}
			<div className="md:w-1/2">
				<h2 className="text-3xl font-bold">
					<span className="text-white">Free</span> Guidance to <br />
					find your <span className="text-white">Best Fit College</span>
				</h2>
				<p className="mt-4 text-lg">
					We will provide you the right guidance to find your best fit college
					for your future career. Our expert Counsellor will take care about
					your career path.
				</p>
				<h3 className="mt-6 font-semibold text-xl">How we guide</h3>
				<ul className="list-disc list-inside mt-3 text-base">
					<li>Tell us your college/ Location and course preference</li>
					<li>We will provide you personalised expert guide</li>
					<li>We start one to one counselling session</li>
					<li>We provide multiple career options based on the preference</li>
					<li>Our expert provides best fit colleges to your preferences</li>
				</ul>
				<button className="mt-6 bg-indigo-700 text-white px-6 py-2 rounded-full flex items-center cursor-pointer">
					📱 Ask to Expert
				</button>
			</div>

			{/* Right Image Section */}
			<div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
				<div className="relative">
					<img
						src="https://picsum.photos/536/354"
						alt="Counsellor"
						className="rounded-lg shadow-lg w-72 md:w-96"
					/>
				</div>
			</div>
		</section>
	);
};

export default GuidanceSection;

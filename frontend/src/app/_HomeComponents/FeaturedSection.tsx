const FeaturedSection = () => {
	return (
		<div className="bg-white py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-blue-600">
						Comprehensive Directory
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Everything You Need to Choose Your College
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Access detailed information about thousands of colleges and
						universities, including programs, admission requirements, campus
						life, and more.
					</p>
				</div>

				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						<div className="flex flex-col">
							<dt className="text-lg font-semibold leading-7 text-gray-900">
								Detailed College Profiles
							</dt>
							<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
								<p className="flex-auto">
									Comprehensive information about academics, campus life, costs,
									and admission requirements for each institution.
								</p>
							</dd>
						</div>
						<div className="flex flex-col">
							<dt className="text-lg font-semibold leading-7 text-gray-900">
								Advanced Search Tools
							</dt>
							<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
								<p className="flex-auto">
									Filter and compare colleges based on location, programs,
									costs, admission rates, and other key factors.
								</p>
							</dd>
						</div>
						<div className="flex flex-col">
							<dt className="text-lg font-semibold leading-7 text-gray-900">
								Student Reviews
							</dt>
							<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
								<p className="flex-auto">
									Real insights from current and former students about their
									experiences at different institutions.
								</p>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	);
};

export default FeaturedSection;

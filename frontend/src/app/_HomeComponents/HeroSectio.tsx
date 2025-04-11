import { Search, BookOpen, Users, School } from "lucide-react";

const HeroSection = () => {
	return (
		<div className="relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9Ii4wNCIvPjwvZz48L3N2Zz4=')] opacity-5" />

			<div className="relative">
				<div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-20">
					{/* Left Section */}
					<div className="max-w-2xl lg:flex-auto">
						{/* Small Badge */}
						<div className="flex">
							<div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
								<span className="font-semibold text-indigo-600">
									Latest Update
								</span>
								<span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
								<a href="#" className="flex items-center gap-x-1">
									500+ new colleges added
									<span className="absolute inset-0" aria-hidden="true" />
									<span aria-hidden="true">&rarr;</span>
								</a>
							</div>
						</div>

						{/* Main Heading */}
						<h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
							Discover Your{" "}
							<span className="relative whitespace-nowrap">
								<span className="relative bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
									Perfect College
								</span>
							</span>
						</h1>

						{/* Description */}
						<p className="mt-5 text-lg leading-7 text-gray-600">
							Navigate your educational journey with confidence. Access
							comprehensive information about colleges, compare institutions,
							and find the perfect match for your academic aspirations.
						</p>

						{/* Search Bar */}
						<div className="mt-8 flex flex-col sm:flex-row gap-4">
							<div className="relative flex-grow">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Search colleges, courses, or locations..."
									className="w-full rounded-lg border-gray-300 pl-10 pr-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							<button className="flex-none rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Search
							</button>
						</div>

						{/* Stats */}
						<div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-10">
							<div className="flex items-center gap-x-3">
								<School className="h-6 w-6 text-indigo-600" />
								<div>
									<div className="text-lg font-semibold text-gray-900">
										1000+
									</div>
									<div className="text-sm text-gray-600">Universities</div>
								</div>
							</div>
							<div className="flex items-center gap-x-3">
								<BookOpen className="h-6 w-6 text-indigo-600" />
								<div>
									<div className="text-lg font-semibold text-gray-900">
										5000+
									</div>
									<div className="text-sm text-gray-600">Courses</div>
								</div>
							</div>
							<div className="flex items-center gap-x-3">
								<Users className="h-6 w-6 text-indigo-600" />
								<div>
									<div className="text-lg font-semibold text-gray-900">
										50K+
									</div>
									<div className="text-sm text-gray-600">Students</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Section (Image) */}
					<div className="relative mt-14 sm:mt-20 lg:mt-0 lg:w-1/2">
						<div className="relative mx-auto w-full max-w-lg">
							<img
								className="w-full max-w-lg rounded-xl shadow-lg ring-1 ring-gray-400/10"
								src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
								alt="College students studying in a modern library"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;

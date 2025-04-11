"use client";

import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-lg nav-fixed">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo and primary nav */}
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/" className="text-2xl font-bold text-gray-800">
								Brand
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								href="/"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300"
							>
								Home
							</Link>
							<Link
								href="/india-colleges"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
							>
								Colleges
							</Link>
							<Link
								href="/about"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
							>
								About
							</Link>
							<Link
								href="/blog"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-gray-300"
							>
								Blog
							</Link>
						</div>
					</div>

					{/* Secondary Nav */}
					<div className="hidden sm:flex sm:items-center sm:space-x-6">
						<button className="text-gray-500 hover:text-gray-700 cursor-pointer">
							<Search className="h-5 w-5" />
						</button>
						<button className="text-gray-500 hover:text-gray-700 cursor-pointer">
							<ShoppingCart className="h-5 w-5" />
						</button>
						<button className="text-gray-500 hover:text-gray-700 cursor-pointer">
							<User className="h-5 w-5" />
						</button>
					</div>

					{/* Mobile menu button */}
					<div className="flex items-center sm:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
						>
							{isMenuOpen ? (
								<X className="block h-6 w-6" />
							) : (
								<Menu className="block h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1">
						<Link
							href="/"
							className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
						>
							Home
						</Link>
						<Link
							href="/india-colleges"
							className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
						>
							Colleges
						</Link>
						<Link
							href="/about"
							className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
						>
							About
						</Link>
						<Link
							href="/blog"
							className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
						>
							Blog
						</Link>
					</div>
					<div className="pt-4 pb-3 border-t border-gray-200">
						<div className="flex items-center justify-around px-4">
							<button className="flex-1 text-gray-500 hover:text-gray-700 flex flex-col items-center">
								<Search className="h-5 w-5" />
								<span className="text-sm">Search</span>
							</button>
							<button className="flex-1 text-gray-500 hover:text-gray-700 flex flex-col items-center">
								<ShoppingCart className="h-5 w-5" />
								<span className="text-sm">Cart</span>
							</button>
							<button className="flex-1 text-gray-500 hover:text-gray-700 flex flex-col items-center">
								<User className="h-5 w-5" />
								<span className="text-sm">Account</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}

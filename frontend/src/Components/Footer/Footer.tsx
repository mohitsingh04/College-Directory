import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-white border-t">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-4">
						<h3 className="text-lg font-bold text-gray-900">Brand</h3>
						<p className="text-gray-600 text-sm">
							Creating amazing products for amazing people. Join us on our
							journey.
						</p>
						<div className="flex space-x-4">
							<Link href="#" className="text-gray-400 hover:text-gray-500">
								<Facebook className="h-5 w-5" />
							</Link>
							<Link href="#" className="text-gray-400 hover:text-gray-500">
								<Twitter className="h-5 w-5" />
							</Link>
							<Link href="#" className="text-gray-400 hover:text-gray-500">
								<Instagram className="h-5 w-5" />
							</Link>
							<Link href="#" className="text-gray-400 hover:text-gray-500">
								<Youtube className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-bold text-gray-900 mb-4">
							Quick Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-gray-600 hover:text-gray-900"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-gray-600 hover:text-gray-900"
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-gray-600 hover:text-gray-900"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-600 hover:text-gray-900"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/faq" className="text-gray-600 hover:text-gray-900">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/shipping"
									className="text-gray-600 hover:text-gray-900"
								>
									Shipping Info
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="text-gray-600 hover:text-gray-900"
								>
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-gray-600 hover:text-gray-900"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="text-lg font-bold text-gray-900 mb-4">Newsletter</h3>
						<p className="text-gray-600 text-sm mb-4">
							Subscribe to our newsletter for updates and exclusive offers.
						</p>
						<div className="flex">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-200"
							/>
							<button className="bg-gray-900 text-white px-4 py-2 rounded-r-md hover:bg-gray-800">
								<Mail className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 mt-8 pt-8">
					<p className="text-center text-gray-500 text-sm">
						© {new Date().getFullYear()} Brand. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

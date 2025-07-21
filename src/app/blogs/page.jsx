"use client";

import React from 'react';


const BlogsPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Private Aviation",
      excerpt: "Explore the latest trends and innovations shaping the private aviation industry.",
      date: "January 15, 2025",
      category: "Industry News",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Top 10 Destinations for Charter Flights",
      excerpt: "Discover the most popular destinations for private charter flights this year.",
      date: "January 10, 2025",
      category: "Travel",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Safety First: Our Commitment to Aviation Safety",
      excerpt: "Learn about our comprehensive safety protocols and maintenance standards.",
      date: "January 5, 2025",
      category: "Safety",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Joy Rides: Making Aviation Accessible",
      excerpt: "How our joy ride services are bringing the thrill of flying to everyone.",
      date: "December 28, 2024",
      category: "Services",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Business Aviation: Maximizing Productivity",
      excerpt: "How private aviation can enhance your business efficiency and productivity.",
      date: "December 20, 2024",
      category: "Business",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "Helicopter Services: Beyond Transportation",
      excerpt: "Exploring the versatile applications of helicopter services in modern times.",
      date: "December 15, 2024",
      category: "Services",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Aviation Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, insights, and stories from the world of aviation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Blog Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Load More Articles
          </button>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 text-center mb-6">
            Get the latest aviation news, flight deals, and industry insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default BlogsPage;
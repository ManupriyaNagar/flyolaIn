import React from "react";

const ArticleSection = () => {
  const articles = [
    {
      image: "/images/travel-1.jpg",
      category: "Event",
      title: "Seamless Travel Starts Here: Why Flyola Is Your Go-To Flight Booking Platform",
      description: "Traveling can often be a stressful experience, from finding the right flight to managing reservations and navigating airport procedures...",
      link: "#"
    },
    {
      image: "/images/travel-2.jpg",
      category: "Event",
      title: "How Flyola Makes Last-Minute Travel Plans Easy and Affordable",
      description: "Sometimes, travel plans change unexpectedly, and finding a last-minute flight can be challenging. At Flyola, we understand the urgency...",
      link: "#"
    },
    {
      image: "/images/travel-3.jpg",
      category: "Event",
      title: "The Flyola Advantage: Why Our Customers Love Us",
      description: "At Flyola, we believe that the best way to build lasting relationships with our customers is by delivering exceptional service...",
      link: "#"
    }
  ];

  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Trending & Popular Articles</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Our management is at the forefront, enabling the team to overcome any hurdles in offering clients hassle-free private air charter solutions.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-60 object-cover" />
            <div className="p-4">
              <span className="text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <h3 className="text-lg font-semibold mt-3">{article.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{article.description}</p>
              <a href={article.link} className="text-red-500 font-semibold mt-3 inline-block">
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArticleSection;

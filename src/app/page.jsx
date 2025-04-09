import Image from "next/image";
import { Suspense, lazy } from "react";
import "./globals.css";

// Correct lazy imports with fallback to handle non-default exports
const FlightBooking = lazy(() => import("@/components/Home/FlightBooking").then(module => ({ default: module.default || module })));
const FeatureCards = lazy(() => import("@/components/Home/FeatureCard").then(module => ({ default: module.default || module })));
const PrivateJetRental = lazy(() => import("@/components/Home/Banner").then(module => ({ default: module.default || module })));
const AviationHighlights = lazy(() => import("@/components/Home/Highlights").then(module => ({ default: module.default || module })));
const FlightOffers = lazy(() => import("@/components/Home/FlightOffers").then(module => ({ default: module.default || module })));
const Hero = lazy(() => import("@/components/Home/Hero").then(module => ({ default: module.default || module })));
const WhyChooseFlyola = lazy(() => import("@/components/Home/WhyChoose").then(module => ({ default: module.default || module })));
const CityCaurasol = lazy(() => import("@/components/Home/CityCaurasol").then(module => ({ default: module.default || module })));
const ArticleSection = lazy(() => import("@/components/Home/Article").then(module => ({ default: module.default || module })));
const HoverEffect = lazy(() => import("@/components/ui/HoverEffect").then(module => ({ default: module.default || module })));
const WorldMapDemo = lazy(() => import("@/components/Home/WorldMapDemo").then(module => ({ default: module.default || module })));
const PopularDestinations = lazy(() => import("@/components/Home/PopularDestinations").then(module => ({ default: module.default || module })));

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <span className="text-gray-500">Loading...</span>
          </div>
        }
      >
        {/* Critical components first for above-the-fold content */}
        <FlightBooking />
        <FeatureCards />

        {/* Less critical components can load later */}
        <PrivateJetRental />
        <AviationHighlights />
        <FlightOffers />
        <Hero />
        <WhyChooseFlyola />
        <CityCaurasol />
        <ArticleSection />
        <HoverEffect />
        <WorldMapDemo />
        <PopularDestinations />
      </Suspense>
    </div>
  );
}
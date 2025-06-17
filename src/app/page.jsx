"use client";

import Image from "next/image";
import { Suspense, lazy } from "react";
import "./globals.css";
import Loader from "@/components/Loader";

// Correct lazy imports with fallback to handle non-default exports
const FlightBooking = lazy(() =>
  import("@/components/Home/FlightBooking").then((module) => ({
    default: module.default || module,
  }))
);
const FeatureCards = lazy(() =>
  import("@/components/Home/FeatureCard").then((module) => ({
    default: module.default || module,
  }))
);
const PrivateJetRental = lazy(() =>
  import("@/components/Home/Banner").then((module) => ({
    default: module.default || module,
  }))
);
const AviationHighlights = lazy(() =>
  import("@/components/Home/Highlights").then((module) => ({
    default: module.default || module,
  }))
);

const Hero = lazy(() =>
  import("@/components/Home/Hero").then((module) => ({
    default: module.default || module,
  }))
);
const WhyChooseFlyola = lazy(() =>
  import("@/components/Home/WhyChoose").then((module) => ({
    default: module.default || module,
  }))
);
const CityCaurasol = lazy(() =>
  import("@/components/Home/CityCaurasol").then((module) => ({
    default: module.default || module,
  }))
);
const ArticleSection = lazy(() =>
  import("@/components/Home/Article").then((module) => ({
    default: module.default || module,
  }))
);
const HoverEffect = lazy(() =>
  import("@/components/ui/HoverEffect").then((module) => ({
    default: module.default || module,
  }))
);
const WorldMapDemo = lazy(() =>
  import("@/components/Home/WorldMapDemo").then((module) => ({
    default: module.default || module,
  }))
);
const PopularDestinations = lazy(() =>
  import("@/components/Home/PopularDestinations").then((module) => ({
    default: module.default || module,
  }))
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loader onLoadingComplete={() => {}} />}>
        <FlightBooking />
        <FeatureCards />
        <PrivateJetRental />
        <AviationHighlights />
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
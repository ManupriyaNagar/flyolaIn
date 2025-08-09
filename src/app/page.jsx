"use client";

import "./globals.css";
import FlightBooking from "@/components/Home/FlightBooking";
import MobileFlightBooking from "@/components/Home/MobileFlightBooking";
import FeatureCards from "@/components/Home/FeatureCard";
import PrivateJetRental from "@/components/Home/Banner";
import AviationHighlights from "@/components/Home/Highlights";
import Hero from "@/components/Home/Hero";
import WhyChooseFlyola from "@/components/Home/WhyChoose";
import CityCaurasol from "@/components/Home/CityCaurasol";
import ArticleSection from "@/components/Home/Article";
import HoverEffect from "@/components/ui/HoverEffect";
import WorldMapDemo from "@/components/Home/WorldMapDemo";
import PopularDestinations from "@/components/Home/PopularDestinations";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Flight Booking - Hidden on mobile */}
      <div className="hidden md:block">
        <FlightBooking />
      </div>
      {/* Mobile Flight Booking - Visible only on mobile */}
      <MobileFlightBooking />
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
    </div>
  );
}
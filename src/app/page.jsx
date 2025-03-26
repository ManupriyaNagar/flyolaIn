import Image from "next/image";
import FlightBooking from "@/components/Home/FlightBooking";
import FeatureCards from "@/components/Home/FeatureCard";
import "./globals.css";
import PrivateJetRental from "@/components/Home/Banner";
import Hero from "@/components/Home/Hero";
import ArticleSection from "@/components/Home/Article";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import CityCaurasol from "@/components/Home/CityCaurasol";
import PopularDestinations from "@/components/Home/PopularDestinations";
import WhyChooseFlyola from "@/components/Home/WhyChoose";
import AviationHighlights from "@/components/Home/Highlights";
import FlightOffers from "@/components/Home/FlightOffers";
    import { WorldMapDemo } from "@/components/Home/WorldMapDemo";
export default function Home() {
  return (
    <div className="">
      <FlightBooking/>
       <FeatureCards/>
       <PrivateJetRental/>
       <AviationHighlights/>
       <FlightOffers/>
       <Hero/>
       <WhyChooseFlyola/>
       <CityCaurasol/>
       <ArticleSection/>
       <HoverEffect/>
       <WorldMapDemo/>
       <PopularDestinations/>
      
    </div>
  );
}

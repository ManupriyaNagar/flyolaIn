import Image from "next/image";
import FlightBooking from "@/components/Home/FlightBooking";
import FeatureCards from "@/components/Home/FeatureCard";
import "./globals.css";
import PrivateJetRental from "@/components/Home/Banner";
import Hero from "@/components/Home/Hero";
import ArticleSection from "@/components/Home/Article";
import FlightSearchCard from "@/components/Home/NextSection";
import { HoverEffect } from "@/components/ui/card-hover-effect";
// import FlightScheduleTable from "@/components/Home/Table";

export default function Home() {
  return (
    <div className="">
      <FlightBooking/>
      {/* <FlightSearchCard/> */}
       <FeatureCards/>
       <PrivateJetRental/>
       <Hero/>
       <ArticleSection/>
       <HoverEffect/>
       {/* <FlightScheduleTable/> */}
    </div>
  );
}

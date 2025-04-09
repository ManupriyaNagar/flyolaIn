"use client"
import { Hero } from "@/components/Business-class/Hero";
import { Usps } from "@/components/Business-class/Ups";


import { VideoCarousel } from "@/components/Business-class/Video";

export default function BusinessClass() {
  return (
    <div className="bg-background relative z-10 mt-30">
      <Hero />
      <Usps/>
      <VideoCarousel />
      <div/>
    </div>
  );
}
